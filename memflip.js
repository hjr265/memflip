class MemFlip {
	constructor(el, options) {
		if (typeof el == 'string') el = document.getElementById(el)
		this.el = el
		if ((options.size[0] * options.size[1]) % 2 != 0) throw new Error('Board size must be even')
		this.options = options
		this.reset()
	}

	reset() {
		const cards = this.makeCards()
		this.el.innerHTML = ''
		this.el.classList.add('memflip__board')
		for (let i = 0; i < cards.length; i++) this.el.appendChild(cards[i])
		for (let i = 0, n = cards.length; i < n; i++) {
			const k = Math.floor(Math.random()*cards.length)
			cards[k].style.order = i
			cards.splice(k, 1)
		}
	}

	makeCards() {
		const images = this.options.images.slice()
		const cards = []
		const [w, h] = this.options.size
		for (let i = 0; i < (h*w)/2; i++) {
			const k = Math.floor(Math.random()*images.length)
			const image = images[k]
			images.splice(k, 1)
			for (let j = 0; j < 2; j++) {
				const card = document.createElement('div')
				card.classList.add('memflip__card')
				card.addEventListener('click', () => this.onCardClick(card))
				const front = document.createElement('div')
				front.classList.add('memflip__cardfront')
				card.appendChild(front)
				const back = document.createElement('div')
				back.classList.add('memflip__cardback')
				card.appendChild(back)
				const img = document.createElement('img')
				img.src = image
				front.appendChild(img)
				cards.push(card)
			}
		}
		return cards
	}

	onCardClick(card) {
		if (this.flipping) return
		if (card.classList.contains('-matched')) return
		card.classList.toggle('-flipped')
		if (this.pairFlipped()) {
			if (this.pairMatched()) this.markMatched()
			else this.unflipCards()
		}
	}

	pairFlipped() {
		return this.el.querySelectorAll('.-flipped:not(.-matched)').length == 2
	}

	pairMatched() {
		let matched = true
		let image = ''
		this.el.querySelectorAll('.-flipped:not(.-matched) img').forEach(img => {
			if (!image) image = img.src
			if (image != img.src) matched = false
		})
		return matched
	}

	markMatched() {
		this.el.querySelectorAll('.-flipped:not(.-matched)').forEach(card => card.classList.add('-matched'))
	}

	unflipCards() {
		this.flipping = true
		this.el.querySelectorAll('.-flipped:not(.-matched)').forEach(card => card.classList.add('-unmatched'))
		setTimeout(() => {
			this.el.querySelectorAll('.-flipped:not(.-matched)').forEach(card => {
				card.classList.remove('-unmatched')
				card.classList.remove('-flipped')
			})
			this.flipping = false
		}, 1000)
	}
}

export default MemFlip
