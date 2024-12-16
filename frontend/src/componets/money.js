export const optionCurrency = {
    prefix: '',
    suffix: ' đ',
    thousands: ',',
    decimal: '.',
    precision : 0
  }
  export const transform =  (value ,args ) => {
    const option = {
      prefix: '$ ',
      suffix: '',
      thousands: ',',
      decimal: '.',
      allowNegative: false,
      precision : 2
    }
    if (isNaN(value.toString())) {
      return value
    } else {
      args = Object.assign(option, args)
      const str = Number(Number(value).toFixed(args.precision)).toString().split('.');
      const numDecimal = !str[1] ? '00' : (Number(str[1]) > 9 || str[1].length > 1) ? str[1] : Number(str[1]) +'0';
      const data = {
        integer: !args.allowNegative ? str[0] : (Number(str[0]) + Math.round(Number(numDecimal))).toString() ,
        decimal: numDecimal
      }
      const check = Number(data.integer) > 0;
      const lengthNumber = data.integer.replace(/\D/g, '').length / 3;
      const numFloor= Math.floor(lengthNumber);
      const numCeil  = Math.ceil(lengthNumber);
      let regexConvert = '';
      let positionConvert  = '';
      let newVal = data.integer.replace(/\D/g, '');
      for (let i = 0; i < numFloor; i++) {
        regexConvert = '(\\d{0,3})' + regexConvert;
      }
      if (numCeil > numFloor) {
        const str = newVal.length % 3 === 1 ? '(\\d{0,1})' : newVal.length % 3 === 2 ? '(\\d{0,2})' : '(\\d{0,3})';
        regexConvert = str + regexConvert;
      }
      for (let i = 0; i < numCeil; i++) {
        positionConvert = i === 0 ? '$' + (i + 1) : positionConvert + args.thousands + '$' + (i + 1);
      }
      const regex  = new RegExp('^' + regexConvert);
      const last = args.precision > 0 ? (args.decimal + data.decimal) : '';
      newVal = (!!args.prefix ? args.prefix : '') + (!check && newVal !== '0' ? '-': '') + newVal.replace(regex, positionConvert) + last + (!!args.suffix ? args.suffix : '');
      return newVal;
    }
  }