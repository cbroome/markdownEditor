describe( 'MarkdownEditor', function() {

    var $editor;
    afterEach( function() {
        $editor = undefined;
    } );
    
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
    
    
    describe( 'when calling insertValueAtCursor', function() {

        var $editor; 
        beforeEach( function() {
            $editor = $( '<div />' ).markdownEditor( 'init' );
            $( 'body' ).append( $editor );
            $editor.markdownEditor( 'setValue', 'test test test test' );
        } );
        
        afterEach( function() {
            $editor.remove();
        } );
        
        
        it( 'should return itself', function() {
            expect( $editor.markdownEditor( 'insertValueAtCursor', '' ) ).toBe( $editor );
        } );
        
        
        it( 'should insert a string', function() {
            var testString = 'unique test ' ;
            $editor.markdownEditor( 'insertValueAtCursor', testString ); 
            expect( $editor.markdownEditor( 'getMarkdown' ) ).toContain( testString );
        } );
        
        
        it( 'should update the preview', function() {
            var testString = 'unique test ', 
                originalHTML = $editor.markdownEditor( 'getHTML' );
            $editor.markdownEditor( 'insertValueAtCursor', testString ); 
            expect( $editor.markdownEditor( 'getHTML' ) ).not.toBe( originalHTML );

        } );
        
    } );
    
    describe( 'when calling addButton', function() {

        var button;
        beforeEach( function() {
            $editor = $( '<div />' ).markdownEditor( 'init' );
            $( 'body' ).append( $editor );
            button = { 
                label: 'test-label', 
                name: 'test-name'
            };
        } );
        
        afterEach( function() {
            $editor.remove();
        } );
        
        
        it( 'should return itself', function() {
            expect( $editor.markdownEditor( 'addButton', button ) ).toBe( $editor );
        } );
        
        
    } );
    
} );