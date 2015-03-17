describe( 'MarkdownEditor', function() {

    var $editor;
    
    describe( 'when initializing', function() {

        var initVal;
        beforeEach( function() {
            initVal = 'test setup value';
        } );
        
        afterEach( function() {
            $editor = undefined;
        } );
        
        it( 'should modify any markdown in the init string', function() {
            var val = 'Testing *this* too';
            $editor = $( '<div>' + val + '</div>' ).markdownEditor( 'init' );
            expect( $editor.markdownEditor( 'getMarkdown' ) ).toBe( val );
            expect( $editor.markdownEditor( 'getHTML' ) ).not.toBe( initVal );
        } );
        
        it( 'should initialize with the current content of the parent node', function() {
            $editor = $( '<div>' + initVal + '</div>' ).markdownEditor( 'init' );
            expect( $editor.markdownEditor( 'getMarkdown' ) ).toBe( initVal );
        } );
        
        

        
    } );
    
    
    describe( 'when calling setValue', function() {

        var value;
        beforeEach( function() {
             $editor = $( '<div />' ).markdownEditor( 'init' );
            value = 'test value';
        } );
        
        it( 'should return a reference to the markdown editor', function() {
            expect( $editor.markdownEditor( 'setValue', value ) ).toBe( $editor );
        } );
        
        it( 'should return the new value', function() {
            $editor.markdownEditor( 'setValue', value );
            expect( $editor.markdownEditor( 'getMarkdown' ) ).toBe( value );
        } );
        
    } );
    
} );