module.exports = (print) => {
  return function* log(next) {
    if (!this.isCombo) {
      const req = this.request;
      const url = req.url;
      print(
        dateFormat('[Y-m-d H:i:s]', new Date()),
        `> ${url}\n`,
        JSON.stringify({
          get: req.query,
          post: req.body
        })
      );
    } else {
      const req = this.request;
      const url = req.url;
      print(
        dateFormat('[Y-m-d H:i:s]', new Date()),
        `> ${url} ${this.status}`,
      );
    }
    yield next;
  };
};

/**
 * 时间格式化函数
 * @params
 *    format 格式
 *    language 语言
 * @example new Date().format('Y-m-d H:i:s')
 * @depends toString
 * @return string
 */
const dateFormat = (format, date, lang) => {
  const _format = format || '';
  const _lang = lang || 'zh';
  const _month_text = {
    zh: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  const _day_text = {
    zh: ['日', '一', '二', '三', '四', '五', '六'],
    en: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
  };
  const _year = date.getFullYear();
  const _month = date.getMonth() + 1;
  const _date = date.getDate();
  const _day = date.getDay();
  const _hour = date.getHours();
  const _minute = date.getMinutes();
  const _second = date.getSeconds();
  return _format.replace(/Y/g, _year)
    .replace(/y/g, _year.toString().substr(2))
    .replace(/M/g, _month_text[_lang][_month - 1])
    .replace(/m/g, _month > 9 ? _month : `0${_month}`)
    .replace(/n/g, _month)
    .replace(/D/g, _day_text[_lang][_day])
    .replace(/d/g, _date > 9 ? _date : `0${_date}`)
    .replace(/j/g, _date)
    .replace(/H/g, _hour > 9 ? _hour : `0${_hour}`)
    .replace(/G/g, _hour)
    .replace(/h/g, (_hour % 12) > 9 ? (_hour % 12) : `0${_hour % 12}`)
    .replace(/g/g, _hour % 12)
    .replace(/i/g, _minute > 9 ? _minute : `0${_minute}`)
    .replace(/s/g, _second > 9 ? _second : `0${_second}`);
};
