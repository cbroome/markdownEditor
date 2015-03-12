describe( 'MarkdownEditor', function() {

    var $editor;
    beforeEach( function() {
        $editor = $( '<div />' ).markdownEditor( 'init' );
    } );
    
    afterEach( function() {
        $editor = undefined;
    } );
    
    describe( 'when initializing', function() {

        var initVal;
        beforeEach( function() {
            initVal = 'test setup value';
        } );
        
        it( 'should initialize with the current content of the parent node', function() {
            $editor = $( '<div>' + initVal + '</div>' ).markdownEditor( 'init' );
            expect( $editor.markdownEditor( 'getMarkdown' ) ).toBe( initVal );
        } );
        
        
        it( 'should modify any markdown in the init string', function() {
            var initVal = 'Testing *this*';
            $editor = $( '<div>' + initVal + '</div>' ).markdownEditor( 'init' );
            expect( $editor.markdownEditor( 'getMarkdown' ) ).toBe( initVal );
            expect( $editor.markdownEditor( 'getHTML' ) ).not.toBe( initVal );
        } );
        
    } );
    
    
    describe( 'when calling setValue', function() {

        var value;
        beforeEach( function() {
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