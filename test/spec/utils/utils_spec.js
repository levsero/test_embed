describe('utilities', function() {
    var buid = '8c80bfcdaed9a4b33d93479f4d6acf22';
    var root = window.top;
    var Zd = root.Zd;

    beforeEach(function() {
        spyOn(root.localStorage, 'getItem').andCallThrough();
        spyOn(root.localStorage, 'setItem').andCallThrough();
    });

    describe('buid', function() {
        beforeEach(function() {
            root.localStorage.clear();
        });

        it('should return an exisiting buid from localStorage', function() {
            root.localStorage.setItem('ZD-buid', buid);
            expect(Zd.identity.getBuid()).toEqual(buid);
        });

        it('should generate and store a new buid if one doesn\'t exist', function() {
            Zd.identity.getBuid();
            expect(root.localStorage.setItem.mostRecentCall.args[0]).toEqual('ZD-buid');
            expect(root.localStorage.setItem.mostRecentCall.args[1].length).toEqual(32);
        })
    });
});
