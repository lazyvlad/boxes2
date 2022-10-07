/**
 * Quality of life helper functions
 * @author lazyvlad
 * @date 10/07/2023
 * 
 */

/**
 * Shorthand for document.querySelector
 * @param {String} selector 
 * @returns QuerySelector 
 */
export function qss(selector){
    let qs = document.querySelector;
    return qs.call(document,...[selector]);
}
/**
 * Shorthand for document.querySelectorAll
 * @param {String} selector - dom query selector
 * @returns QuerySelectorAll
 */
export function qsa(selector){
    let qs = document.querySelectorAll;
    return qs.call(document,...[selector]);
}