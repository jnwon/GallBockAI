<template>
    <div id="resourceDashboard" style="justify-content:space-between; background-color: rgb(59, 72, 144); color:#fff">
      <div style="justify-content:space-between; width:90%">
        <div class="trio">
            <i class="fas fa-clock"></i>
            <div class="progress" style="width:70%">
                <div :class="'progress-bar progress-bar-' + getColor(rpmRate)" role="progressbar" :aria-valuenow="rpmRate" aria-valuemin="0" aria-valuemax="100" :style="'width:' + rpmRate + '%'">
                    <strong>{{rpmRemain}}/{{rpm}}</strong>
                </div>
            </div>
        </div>
        <div class="trio">
            <i class="fas fa-file"></i>
            <div class="progress" style="width:70%">
                <div :class="'progress-bar progress-bar-' + getColor(tpmRate)" role="progressbar" :aria-valuenow="tpmRate" aria-valuemin="0" aria-valuemax="100" :style="'width:' + tpmRate + '%'">
                    <strong>{{apmRemain}}/{{apm}}</strong>
                </div>
            </div>
        </div>
        <div class="trio">
            <i class="fas fa-calendar-day"></i>
            <div class="progress" style="width:70%">
                <div :class="'progress-bar progress-bar-' + getColor(rpdRate)" role="progressbar" :aria-valuenow="rpdRate" aria-valuemin="0" aria-valuemax="100" :style="'width:' + rpdRate + '%'">
                    <strong>{{rpdRemain}}/{{rpd}}</strong>
                </div>
            </div>
        </div>
      </div>
      <i class="fas fa-info-circle" style="cursor:pointer; width:10%" v-tooltip:bottom="'실시간 통합리소스 사용현황 대시보드(잔여량/한도)<br>좌측부터<br>분당 통합 분석요청횟수,<br>분당 통합 분석량(게시물수),<br>일일 통합 분석요청횟수 입니다.<br>일일 통합 분석요청 가능 횟수는 매일 16~17시경 충전됩니다.'"></i>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'ResourceDashboard',
    data () {
        return {
            rpm: 1,
            rpmRemain: 0,
            rpmRate: 0,
            tpm: 1,
            tpmRemain: 0,
            tpmRate: 0,
            rpd: 1,
            rpdRemain: 0,
            rpdRate: 0,
            atpa: 44,
            apm: 1,
            apmRemain: 0,
            endpoint: process.env.VUE_APP_SERVER_ENDPOINT
        }
    },
    async mounted() {
        setInterval(async () => {
            await axios.get(this.endpoint + '/api/get/gemini/resources', {validateStatus: (status) => {return status < 500}}).then((res) => {
                if(res.status == 200){
                    this.rpm = parseInt(res.data.rpm.split('/')[1]);
                    this.rpmRemain = this.rpm - parseInt(res.data.rpm.split('/')[0]);
                    this.rpmRate = Math.round(this.rpmRemain * 100 / this.rpm);
                    this.tpm = parseInt(res.data.tpm.split('/')[1]);
                    this.tpmRemain = this.tpm - parseInt(res.data.tpm.split('/')[0]);
                    this.tpmRate = Math.round(this.tpmRemain * 100 / this.tpm);
                    this.rpd = parseInt(res.data.rpd.split('/')[1]);
                    this.rpdRemain = this.rpd - parseInt(res.data.rpd.split('/')[0]);
                    this.rpdRate = Math.round(this.rpdRemain * 100 / this.rpd);
                    this.atpa = parseFloat(res.data.atpa);
                    this.apm = parseInt(this.tpm / this.atpa);
                    this.apmRemain = parseInt(this.tpmRemain / this.atpa);
                }
                else{
                    console.log(res.status, res.data.info);
                }
            }).catch((data) => {
                console.log(data.message);
            });
        }, 1000);
    },
    methods: {
        getColor(rate) {
            if(rate < 30) {
                return 'danger';
            }
            if(rate < 50) {
                return 'warning';
            }
            return 'info';
        }
    }
}
</script>

<style scoped>
div {
    display:flex;
}
i {
    margin:10px;
}
.progress {
    margin-bottom: 0px;
}
.progress-bar  {
    display:block;
    color:black;
}

.trio {
    flex: 1;
    justify-content: left;
    align-items: center;
}
</style>