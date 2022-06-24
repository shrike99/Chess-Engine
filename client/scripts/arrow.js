class ArrowHandler {
	constructor() {
		this.temp = [];
		this.list = [];
	}

	search(vector) {
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i][1].equals(vector) && this.list[i][0].equals(this.temp[0])) return i;
		}
		return -1;
	}

	startPoint(x, y) {
		this.temp.push(createVector(x, y));
	}

	endPoint(x, y) {
		if (this.temp.length === 0) return;

		if (this.temp[0].x === x && this.temp[0].y === y) {
			this.temp = [];
			return;
		}

		const searchI = this.search(createVector(x, y));
		if (searchI !== -1) {
			this.list.splice(searchI, 1);
			this.temp = [];
			return;
		}

		this.list.push([this.temp[0], createVector(x, y)]);
		this.temp = [];
	}

	clear() {
		this.list = [];
	}
}
