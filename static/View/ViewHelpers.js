export default class ViewHelpers {

    static createElementWithClassName(type, className) {
        let element = document.createElement(type ? type : "div")
        if (className) {
            element.className = className
        }
        return element
    }

}