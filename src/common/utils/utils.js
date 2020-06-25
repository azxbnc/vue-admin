
export function stripscript(s)
{
var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！%@#￥ ……&*（）——|{}【】‘；：”“'。，、？]")
var rs = "";
for (var i = 0; i < s.length; i++) {
rs = rs+s.substr(i, 1).replace(pattern, '');
}
return rs;
}

export function validateEmail(value) {
    let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if(!reg.test(value)) {
        return true;
    } else {
        return false;
    }
}