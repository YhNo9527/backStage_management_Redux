export function formateDate(time) {
    if(!time){
        return ''
    }
    // 判断时间位数是否是两位数，否则前面加‘0’
    let date = new Date(time)
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    if(month < 10) {
        month = '0' + month
    }
    if(day < 10) {
        day = '0' + day
    }
    if(hour < 10) {
        hour = '0' + hour
    }
    if(minute < 10) {
        minute = '0' + minute
    }
    if(second < 10) {
        second = '0' + second
    }
    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}