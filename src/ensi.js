/**
 * @author DURAND Malo
 * @name ENSI (Edge No Search Image)
 * @description Bypass Microsoft Edge Search Image feature
 * @license GNU_GPL_V3
 */

class CanvasHandler {
    /**
     * constructor
     * @param {HTMLCanvasElement} canvas The Canvas element
     */
    constructor(canvas) {
        const self = this

        this.canvas = canvas
        this.receptacle = new Image()

        this.base64 = ""

        this.receptacle.onload = this.receptacle.onchange = function (e) {
            if (!self.canvas.getContext)
                throw `Canvas.getContext is not available.`
            self.canvas.width = this.width
            self.canvas.height = this.height
            const ctx = self.canvas.getContext("2d")
            ctx.drawImage(this, 0, 0, ctx.canvas.width, ctx.canvas.height)
        }
    }

    base64FromAttribute(attribute) {
        const img = this.canvas.getAttribute(attribute)
        if (!img) throw `Attribute not found. Attribute : "${attribute}"`
        const metaMatch = /^data:image\/\w+;base64,/.exec(img)
        if (!metaMatch || metaMatch.length !== 1) throw `Invalid attribute value. Attribute : "${attribute}`
        const meta = metaMatch[0]
        try {
            atob(img.slice(meta.length))
        } catch (e) {
            throw `Invalid base64 image`
        }
        this.base64 = img
        return this
    }

    base64FromURL(attribute, asynchronous) {
        const self = this
        const url = this.canvas.getAttribute(attribute)
        const xhr = new XMLHttpRequest()
        xhr.open("GET", url, asynchronous)
        xhr.onreadystatechange = function (e) {
            if (this.readyState !== this.DONE)
                return
            if (this.status !== 200)
                throw `Bad status code : ${this.status}`
            self.base64 = this.responseText
        }
        xhr.send(null)
        return this
    }

    rescaleWithWidth(width) {
        const ratio = width / this.receptacle.width
        this.receptacle.width = width
        this.receptacle.height *= ratio
        return this
    }

    rescaleWithHeight(height) {
        const ratio = height / this.receptacle.height
        this.receptacle.height = height
        this.receptacle.width *= ratio
        return this
    }

    load() {
        if (this.base64 === "") {
            console.warn(`You may set asynchronous parameter to 'false' if you're using the base64FromURL method.`)
            return this
        }
        this.receptacle.src = this.base64
        console.log(this.receptacle.src)
        return this
    }
}

function ensi(selector) {
    const canvas = document.querySelectorAll(selector)
    if (canvas.length === 0) throw `Canvas not found. Selector : "${selector}"`
    if (!canvas instanceof HTMLCanvasElement) throw `The selector "${selector}" points to a non-canvas HTML.`
    return new CanvasHandler(canvas[0])
}