<template>
  <div class="container">
    <img v-if="fetching" style="scale:0.7" src="@/assets/mandu_wink.png">
    <img v-else-if="gemining" style="scale:0.7" src="@/assets/mandu_kyaa.png">
    <img v-else style="scale:0.7" src="@/assets/mandu.png">
    <div style="height: 50px; align-content:center">
      <h4 v-if="fetching" style="font-size:small">원활한 성능을 위해 게시물의 최대 검색범위는<br>20페이지 내외로 제한됩니다.</h4>
      <h4 v-else-if="aiRsp == ''">갤떡 <strong style="color:blue">AI</strong>가 요약해줌</h4>
      <h4 v-else> {{ (lastGallDate? lastGallDate.substring(5,16) + ' ~ ' : '') + (endDt? endDt.substring(5,16).replace('T', ' ') : '') + (' | ' + articleNum + '게시물') }}</h4>
    </div>
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-8">
        <div style="display: flex; justify-content: space-between; text-align: justify; padding: 10px">
          <span style="margin-right: 20px; cursor: pointer;" onclick="window.$('#setting').modal('show')"><i class="fas fa-cog"/></span>
          <div v-if="fetching" class="progress" style="width: 70%">
            <div class="progress-bar progress-bar-striped active" role="progressbar" :aria-valuenow="fetchedProps" aria-valuemin="0" aria-valuemax="100" :style="'width:' + fetchedProps + '%'">
              {{ fetchedProps }}%
            </div>
          </div>
          <div v-else-if="gemining" class="progress" style="width: 70%">
            <div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%">
              AI 분석중..
            </div>
          </div>
          <!-- <span v-if="users.length > 0" style="cursor: pointer; position:absolute; right: 15%;" onclick="window.$('#exportOption').modal('show')"><i class="fas fa-share-alt"></i></span> -->
          <span v-if="!fetching && !gemining" style="cursor: pointer;" @click="fetchData()"><i class="fas fa-play"></i></span>
          <span v-else style="cursor: pointer;" @click="abort()"><i class="fas fa-stop"></i></span>
        </div>
        <div v-if="aiRsp" class="well" style="text-align: left;">
          {{ aiRsp }}
        </div>
        <div :style="'display: flex; text-align: center; padding: 10px; justify-content: ' + (aiRsp? 'space-between' : 'center')">
          <span>개발자연락처: <a href="mailto:atalanta1618@gmail.com?subject=[갤떡요약.ai] ">atalanta1618@gmail.com</a></span>
          <span v-if="aiRsp"> <a href="#">Top</a></span>
        </div>

      </div>
      <div class="col-sm-2"></div>
    </div>

    <div id="setting" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body" style="text-align: left;">
                    <div style="display:flex;">
                      <h4 style="margin-right:15px">갤 ID&nbsp;<i class="far fa-question-circle" style="cursor:pointer" v-tooltip="'gall.dcinside.com/board/lists?id=mlp 에서 mlp'"></i></h4>
                      <div class="checkbox">
                          <label>
                              <input type="checkbox" v-model="isMinorGallery">
                              마이너 갤러리
                          </label>
                      </div>
                    </div>
                    <div style="display:flex; margin-bottom: 20px;">
                        <input type="text" v-model="gallId" style="height:26px; margin-right:10px;" @keypress.enter="checkGallId()"/>
                        <button type="button" class="btn btn-sm btn-default" style="height:26px;" @click="checkGallId()"> 확인 <i v-if="checking" class="fa fa-spinner fa-spin"/></button>    
                    </div>
                    <div style="display:flex; margin-bottom: 20px">
                      <h5 style="margin-right:10px">지난</h5>
                      <button style="margin-right:10px" type="button" class="btn" @click="quickSet(3)"> 3시간 </button>
                      <button style="margin-right:10px" type="button" class="btn" @click="quickSet(6)"> 6시간 </button>
                      <button style="margin-right:10px" type="button" class="btn" @click="quickSet(12)"> 12시간 </button>
                      <button style="margin-right:10px" type="button" class="btn" @click="quickSet(24)"> 24시간 </button>
                    </div>
                    <h5>또는</h5>
                    <h4>검색범위 시작일자</h4>
                    <Datepicker :endDate="endDt" :setDate="startDt" @update-date="setStrtDt" style="height:26px;"/>
                    &nbsp;&nbsp;
                    <select style="width:80px; height:26px; padding: 1px 0 1px 10px; margin:0 10px 0 0" v-model="startTime">
                        <option :value="time" v-for="(time, index) in selectTimeSet" :key="index">{{renderTime(time)}}</option>
                    </select>
                    <h4>검색범위 종료일자</h4>
                    <Datepicker :startDate="startDt" :setDate="endDt" @update-date="setEndDt" style="height:26px;"/>
                    &nbsp;&nbsp;
                    <select style="width:80px; height:26px; padding: 1px 0 1px 10px; margin:0 10px 0 0" v-model="endTime">
                        <option :value="time" v-for="(time, index) in selectTimeSet" :key="index">{{renderTime(time)}}</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <label>
                        <input type="checkbox" v-model="onlyRecommends">
                        개념글만 분석
                    </label>
                    <button style="margin-left:20px" type="button" class="btn btn-info" data-dismiss="modal"> 완료 </button>
                </div>
            </div>  
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Datepicker from '@/components/Datepicker.vue'

export default {
  name: 'GallBockAi',
  components: {
    Datepicker
	},
  data () {
    return {
      fetching: false,
      gemining: false,
      checking: false,
      isChecked: false,
      isMobile: false,
      isMinorGallery: false,
      onlyRecommends: false,
      gallId: '',
      startDt: '',
      startTime: '',
      endDt: '',
      endTime: '',
      aiRsp: '',
      lastGallDate: '',
      articleNum: 0,
      daterange: 0,
      fetchedDates: 0,
      fetchedProps: 0,
      otp: null,
      export:'',
      exportUsers: true,
      exportArticles: true,
      tutorial: 0,
      selectTimeSet: [],
      endpoint: process.env.VUE_APP_SERVER_ENDPOINT
    }
  },
  async mounted() {
    this.isMobile = window.innerWidth < 450;
    for(var i=0; i < 24*4; i++) {
        this.selectTimeSet.push(i*15);
    }
    const now = new Date();
    this.endDt = now.toISOString();
    this.startDt = (new Date(now.getTime() - (60 * 60 * 1000))).toISOString();
    const endTimeStr = (new Date(now.getTime() + (9 * 60 * 60 * 1000))).toISOString().split('T')[1];
    this.endTime = parseInt(endTimeStr.split(':')[0])*60 + parseInt(endTimeStr.split(':')[1]) - parseInt(endTimeStr.split(':')[1])%15;
    const startTimeStr = (new Date(now.getTime() + (8 * 60 * 60 * 1000))).toISOString().split('T')[1];
    this.startTime = parseInt(startTimeStr.split(':')[0])*60 + parseInt(startTimeStr.split(':')[1]) - parseInt(startTimeStr.split(':')[1])%15;

    window.$('#setting').modal('show')
  },
  watch: {
    gallId() {
      this.isChecked = false;
    }
  },
  methods: {
    renderTime(time) {
        return String(Math.floor(time / 60)).padStart(2, "0") + ':' + String(time % 60).padStart(2, "0")
    },
    setStrtDt(date) {
        this.startDt = new Date(date).toISOString();
    },
    setEndDt(date) {
        this.endDt = new Date(date).toISOString();
    },
    quickSet(offset) {
      const now = new Date();
      this.endDt = now.toISOString();
      this.startDt = (new Date(now.getTime() + (-offset * 60 * 60 * 1000))).toISOString();
      const endTimeStr = (new Date(now.getTime() + (9 * 60 * 60 * 1000))).toISOString().split('T')[1];
      this.endTime = parseInt(endTimeStr.split(':')[0])*60 + parseInt(endTimeStr.split(':')[1]) - parseInt(endTimeStr.split(':')[1])%15;
      const startTimeStr = (new Date(now.getTime() + ((9-offset) * 60 * 60 * 1000))).toISOString().split('T')[1];
      this.startTime = parseInt(startTimeStr.split(':')[0])*60 + parseInt(startTimeStr.split(':')[1]) - parseInt(startTimeStr.split(':')[1])%15;
    },
    async checkGallId() {
      if(!this.gallId) {
        alert('갤 ID를 입력하세요.')
        return;
      }

      var request = {
        gallId: this.gallId,
        isMinorGallery: this.isMinorGallery,
        page: 1
      }
      this.checking = true;
      await axios.post(this.endpoint + '/api/crawl/gall/sbest', request, {validateStatus: (status) => {return status < 500}}).then((res) => {
          if(res.status == 200){
            alert('갤 ID가 확인되었습니다.')
            this.isChecked = true;
          }
          else{
            alert(res.status, res.data);
          }
      }).catch(() => {
        alert('존재하지않는 갤 ID입니다.')
      });
      this.checking = false;
    },
    async fetchData() {
      if(!this.otp) {        
        if(!this.isChecked) {
          alert('갤 ID 확인을 완료해주세요.')
          return;
        }
  
        if(!this.startDt) {
          alert('검색범위 시작일자를 선택하세요.');
          return;
        }
  
        const now = new Date();
        const startDateTimeISOSeoul = this.startDt.split('T')[0] + 'T' + this.renderTime(this.startTime) + ':00';
        const endDateTimeISOSeoul = this.endDt.split('T')[0] + 'T' + this.renderTime(this.endTime) + ':00';
        this.daterange = (now.getTime() - new Date(startDateTimeISOSeoul).getTime()) / (3600*24*1000);
        this.otp = now.getTime();
  
        var i = 1
        this.fetching = true;
        while(this.fetching) {
          var request = {
            otp: this.otp,
            gallId: this.gallId,
            isMinorGallery: this.isMinorGallery,
            exceptionModeForRecommend: this.onlyRecommends,
            startDt: startDateTimeISOSeoul,
            endDt: endDateTimeISOSeoul,
            page: i++
          }
          await axios.post(this.endpoint + '/api/crawl/gall/summary', request, {validateStatus: (status) => {return status < 500}}).then((res) => {
              if(res.status == 200){
                this.lastGallDate = res.data.lastGallDate;
                this.fetchedDates = (now.getTime() - (new Date(this.lastGallDate)).getTime()) / (3600*24*1000)
                this.fetchedProps = parseInt(this.fetchedDates *100 / this.daterange)
                this.articleNum = this.articleNum + Math.abs(parseInt(res.data.articleNum));
                if(parseInt(res.data.articleNum) < 0) {
                  this.fetching = false;
                }
              }
              else{
                  alert(res.status, res.data);
              }
          }).catch(() => {
            this.articleNum = 0;
            this.fetching = false;
          });
        }

        if(this.articleNum == 0) {
          alert('서버와의 통신이 원활하지 않습니다.\n관리자에게 문의하세요.');
          this.otp = null;
          return;
        }
      }

      this.gemining = true;
      request = {
        otp: this.otp,
        cmnCode: 1
      }
      await axios.post(this.endpoint + '/api/crawl/gall/summary', request, {validateStatus: (status) => {return status < 500}}).then((res) => {
          if(res.status == 200){
            this.aiRsp = res.data.aiRsp;
            if(parseInt(res.data.articleNum) != -4) {
              this.otp = null;
            }
          }
          else{
              alert(res.status, res.data);
          }
      });
      this.gemining =false;
    },
    async abort() {
      if(confirm('분석을 중단하고 페이지를 새로고침 하시겠습니까?')) {
        this.fetching = false;
        var request = {
          otp: this.otp,
          cmnCode: 2
        }
        await axios.post(this.endpoint + '/api/crawl/gall/summary', request, {validateStatus: (status) => {return status < 500}}).then((res) => {
            if(res.status == 200){
              location.reload();
            }
            else{
                alert(res.status, res.data);
            }
        }).catch(() => {
          alert('서버와의 통신이 원활하지 않습니다.\n중단버튼을 다시 실행해주세요.\n본 메세지가 반복될경우 관리자에게 문의하세요.');
        });
      }
    }
  }
}
</script>
