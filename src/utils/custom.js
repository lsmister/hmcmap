/**
 * 获取两个对象的交集
 * @param {Object} obj 源对象
 * @param {Object} targetObj 目标对象
 */
export function customObjectCopy(obj, targetObj) {
    let res = new Object()
    for(let key in obj){
        if(targetObj.hasOwnProperty(key)) {
            res[key] = obj[key]
        }
         
    }
    return res
}
    