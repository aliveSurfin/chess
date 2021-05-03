export default class ViewHelpers {

    static createElementWithClassName(type, className) {
        let element = document.createElement(type ? type : "div")
        if (className) {
            element.className = className
        }
        return element
    }
    static removeChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.lastChild);
        }
    }

}