// The DisjSet class holds a disjoint set used for finding sizes of tile clusters on the board. It
// utilizes code from https://www.geeksforgeeks.org/disjoint-set-data-structures/ for all functionality
// except for the sizes array. This separate array was added to make finding sizes of clusters faster.


export default class DisjSet {
    
    // The constructor creates all arrays used in the functions. 
    constructor(n) {
        this.rank = new Array(n);
        this.parent = new Array(n);
        this.n = n;
        this.sizes = new Array(n);

        this.makeSet();
    }
 
    // This debug function prints the parent array to the console.
    debugPrint() {
        for (let i = 0; i < 80; i++) {
            console.log(this.parent[i]);
        }
    }

    // Get parent finds the size of the head of a node. It keeps accessing the parents of a node until it finds a node who's size
    // is not zero, meaning it is the head.
    getParentSize(n) {
        let size = this.sizes[n];

        while (size == 0) {
            n = this.parent[n];
            size = this.sizes[n];
        }

        return size;
    }

    // To make the set, all nodes point to themselves at the parent (meaning that parent[i] = i). It
    // also sets all sizes array entries to 1. When two nodes are merged, the sizes value of the new head
    // is increment by the sizes value of the non-head unioned node.
    makeSet() {
        for (let i = 0; i < this.n; i++) {
            this.parent[i] = i;
            this.sizes[i] = 1;
        }
    }
 
    // Get parent finds the head of a node. It recursively accesses the head of the node until a node is its
    // own parent, meaning it is the head.
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
 
    // Union takes two node indicies and makes one of the head of the other. It uses the rank to compare
    // the two, and the highter rank becomes the new head.
    Union(x, y) {
        // xset and yset are the parents of x and y, so merging two nodes really merges their parents.
        let xset = this.find(x);
        let yset = this.find(y);
 
        // This means they are in the same disjoint set already so no unioning must occur.
        if (xset === yset) return;
 
        // This portion checks the rank to make a head. It then updates the parent array and sizes array.
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