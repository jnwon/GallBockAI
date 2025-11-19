<template>
    <input/>
</template>

<script>
export default {
    name: 'DatePicker',
    props: {
        startDate: {
            type: String,
            default: null
        },
        endDate: {
            type: String,
            default: null
        },
        setDate: {
            type: String,
            default: null
        },
        isMobile: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        var self = this;
        window.$(this.$el).datepicker({
            language: 'ko',
            autoClose: true,
            dateFormat: this.isMobile? 'mm-dd' : 'yyyy-mm-dd',
            minDate: new Date('2021-04-01'),
            onSelect(d) {
                self.$emit('update-date', d)
            }
        });
    },
    watch: {
        startDate(val) {
            if(val) {
                window.$(this.$el).datepicker({
                    minDate: new Date(val)
                })
            }
        },
        endDate(val) {
            if(val) {
                window.$(this.$el).datepicker({
                    maxDate: new Date(val)
                })
            }
        },
        setDate(val) {
            if(val) {
                window.$(this.$el).datepicker().data("datepicker").selectDate(new Date(val));
            }
        }
    },
    beforeUnmount() {
        window.$(this.$el).datepicker('hide').datepicker('destroy')
    }
}
</script>