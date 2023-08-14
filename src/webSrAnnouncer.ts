type POLITENESS_SETTING = "assertive" | "polite"
const DELAY_CLEAR = 1000

// div container for aria-live elements.
let container: HTMLElement | null = null

// containers for assertive and polite.
let liveRegions: { [key: string]: null | HTMLDivElement } = {
	assertive: null,
	polite: null,
}
// timer to clear the regions:
const timers: { [key: string]: null | number } = {
	assertive: null,
	polite: null,
}

function createAriaLive(type: POLITENESS_SETTING) {
	let node = document.createElement("div")
	node.setAttribute("aria-live", type)
	node.setAttribute("aria-atomic", "true")
	node.setAttribute("aria-relevant", "all")
	node.setAttribute("role", "status")
	return node
}

function setContent(node: HTMLDivElement, text: string) {
	if (container) {
		const oldContent = node.textContent
		if (text === oldContent) {
			// add a space character to the end to make the new text different.
			text += "&nbsp;"
		}
		node.innerHTML = text
	}
}

/**
 * this function creates or initializes the containers for the aria-live regions.
 * call this before use announce function, otherwise the first message can be lost.
 * @param nodeId - optional, if you want to use your own html container for the aria live regions.
 */
function initialize(nodeId?: string) {
	if (container) {
		return
	}
	if (nodeId) {
		container = document.getElementById(nodeId)
		if (!container) {
			console.error("unable to get the specified id element", nodeId)
			return
		}
	} else {
		container = document.createElement("div")
		document.body.prepend(container)
	}

	// hide the main container element from the screen.
	Object.assign(container.style, {
		border: 0,
		clip: "rect(0 0 0 0)",
		clipPath: "inset(50%)",
		height: "1px",
		margin: "-1px",
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		width: "1px",
		whiteSpace: "nowrap",
	})

	liveRegions.assertive = createAriaLive("assertive")
	liveRegions.polite = createAriaLive("polite")
	container.appendChild(liveRegions.assertive)
	container.appendChild(liveRegions.polite)
}

/**
 * removes the containers used for live regions.
 * you usually don't need to use this
 */
function terminate() {
	if (container) {
		document.body.removeChild(container)
		container = null
		liveRegions = {}
	}
}

/**
 * update the aria-live region with the specified message. If a screen reader is active, should speak the message.
 * @param text - the text to be announced by an active screen reader.
 * @param politeness - assertive or polite,. Use the mdn documentation for more information.
 * @param timeout - optional. The delay time to clear the live region, so the message can't be seen using navigation functions.
 */
function announce(
	text: string,
	politeness: POLITENESS_SETTING = "assertive",
	timeout = DELAY_CLEAR,
) {
	if (!container) {
		initialize()
	}
	const option = politeness.toLowerCase()
	const node = liveRegions[option]
	if (node) {
		setContent(node, text)
		if (timers[option]) {
			clearTimeout(timers[option] as number)
		}
		timers[option] = setTimeout(() => {
			if (liveRegions[option]) {
				;(liveRegions[option] as HTMLDivElement).innerHTML = ""
			}
			timers[option] = null
		}, timeout)
	}
}

const srAnnouncer = {
	initialize,
	terminate,
	announce,
}
export default srAnnouncer
