export default class DisjSet {
    constructor(n) {
        //TODO: Add superball variables in the constructor
        this.rank = new Array(n);
        this.parent = new Array(n);
        this.n = n;
        this.makeSet();
    }
 
    makeSet() {
        for (let i = 0; i < this.n; i++) {
            this.parent[i] = i;
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
        } else if (this.rank[xset] > this.rank[yset]) {
            this.parent[yset] = xset;
        } else {
            this.parent[yset] = xset;
            this.rank[xset] = this.rank[xset] + 1;
        }
    }
}
 
// usage example
let obj = new DisjSet(5);
obj.Union(0, 2);
obj.Union(4, 2);
obj.Union(3, 1);
 
if (obj.find(4) === obj.find(0)) {
  console.log("Yes");
} else {
  console.log("No");
}
if (obj.find(1) === obj.find(0)) {
  console.log("Yes");
} else {
  console.log("No");
}