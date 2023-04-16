// Disjset holds the disjoint set as well as the sizes array.

export default class DisjSet {
    constructor(n) {
        //TODO: Add superball variables in the constructor
        this.rank = new Array(n);
        this.parent = new Array(n);
        this.n = n;

        // Matthew code
        this.sizes = new Array(n);
        // end of matthew's code

        this.makeSet();
    }
 
    decodePrint() {
        for (let i = 0; i < 80; i++) {
            console.log(this.parent[i]);
        }
    }

    getParentSize(n) {
        let size = this.sizes[n];

        while (size == 0) {
            n = this.parent[n];
            size = this.sizes[n];
        }

        return size;
    }

    makeSet() {
        for (let i = 0; i < this.n; i++) {
            this.parent[i] = i;

            // matthew code
            this.sizes[i] = 1;
        }
    }
 
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
 
    Union(x, y) {
        let xset = this.find(x);
        let yset = this.find(y);
 
        if (xset === yset) return;
 
        if (this.rank[xset] < this.rank[yset]) {
            this.parent[xset] = yset;
            this.sizes[yset] += this.sizes[xset];
            this.sizes[xset] = 0;
        } else if (this.rank[xset] > this.rank[yset]) {
            this.parent[yset] = xset;
            this.sizes[xset] += this.sizes[yset];
            this.sizes[yset] = 0;
        } else {
            this.parent[yset] = xset;
            this.sizes[xset] += this.sizes[yset];
            this.sizes[yset] = 0;
            this.rank[xset] = this.rank[xset] + 1;
        }
    }
}