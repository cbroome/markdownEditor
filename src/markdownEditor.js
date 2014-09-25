(function (factory) {
if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define( ['jquery'], factory );
} else {
    // No AMD. Register plugin with global jQuery object.
    factory( jQuery );
}
}(function ($) {    
    
    $.fn.markdownEditor = function ( action, options ) { 
        
        var actions = {
            init: $.proxy( $.fn.markdownEditor.init, this ),
            getHTML: $.proxy( $.fn.markdownEditor.getHTML, this ),
            getMarkdown: $.proxy( $.fn.markdownEditor.getMarkdown, this ), 
            setValue: $.proxy( $.fn.markdownEditor.setValue, this )
        };
        
        return actions[ action ]( options );
        
    };  
    
    
    $.fn.markdownEditor.init = function( options ) {
        var $this = $( this ),
            markdownEditor = new $.fn.markdownEditor.MarkdownEditor( $this );
        markdownEditor.render();

        // Make the markdownEditor accessible in a roundabout way
        $this.data( 'markdownEditor', markdownEditor );
        return this;
    };
    
    $.fn.markdownEditor.getHTML = function() {
        var $this = $( this );
        return $this.data( 'markdownEditor' ).getHTML();
    };
    
    $.fn.markdownEditor.getMarkdown = function() {
        var $this = $( this );
        return $this.data( 'markdownEditor' ).getMarkdown();
    };
    
    $.fn.markdownEditor.setValue = function( value ) {
        var $this = $( this );
        return $this.data( 'markdownEditor' ).setValue( value );
    };
    
    
    /*
     * 
     * Class
     * 
     */
    
     $.fn.markdownEditor.MarkdownEditor = function( $el ) {
        this.$el = $el;
        this.initialize(); 
    };
    
    $.extend( 
         $.fn.markdownEditor.MarkdownEditor.prototype, 
        {
            /**
             * @property    {jQuery}    $textarea
             */
            $textarea: undefined,
            
            /**
             * @property    {jQuery}    $preview
             */
            $preview: undefined,
            
            /**
             * Updates the preview div with the rendered content from the textarea
             */
            _updatePreview: function() {
                
                var rawValue = this.$textarea.val(),
                    token = '!!!UNIQUE_TOKEN!!!', 
                    regex = new RegExp( token ),
                    $temporaryHTML = $( '<div />' ).append( rawValue ), 
                    contents = $temporaryHTML.first().contents(),
                    elements = [],
                    element,
                    parsedValue,
                    regex,
                    i;
                
                // only want to transform text nodes, jQuery::children would skip them                
                contents.each( function() {
                    // swap the node with a token, store the html
                    if( this.nodeType === 1 ) {
                        elements.push( $( this ).clone().wrap( '<p>' ).parent().html() ); 
                        $( this ).replaceWith( token );
                    }
                } );
                
                parsedValue = markdown.toHTML( $temporaryHTML.html() );
                
                // replace those tokens with their proper nodes. 
                while( elements.length ) {
                    element = elements.shift(); 
                    parsedValue = parsedValue.replace( regex, element ); 
                }
                
                this.$preview.html( parsedValue );            
            },
            
            /**
             * @param   {jQuery}    $el     optional element to append
             * @returns {jQuery}
             */
            _createColumn: function( $el ) {
                var $column = $( '<div class="md-column" />' ); 
                if( $el ) {
                    $column.append( $el );
                }
                return $column;
            },
            
            
            /**
             * Add some good key bindings...
             * 
             * @param   {Event} evt
             */
            _textareaBehavior: function( evt ) {
                
                // Tab Key
                if( evt.keyCode === 9) { 
                    // see: http://stackoverflow.com/a/6140696/684438
                    // tab was pressed
                    // get caret position/selection
                    var start   = evt.target.selectionStart,
                        end     = evt.target.selectionEnd,
                        value   = this.$textarea.val();
                    
                    // set textarea value to: text before caret + tab + text after caret
                    this.$textarea.val( 
                        value.substring( 0, start )
                        + "\t"
                        + value.substring( end )
                    );

                    // put caret at right position again (add one for the tab)
                    evt.target.selectionStart = evt.target.selectionEnd = start + 1;

                    // prevent the focus lose
                    evt.preventDefault();
                }
            },
            
            
            initialize: function() {
                
            },
            
            
            /**
             * Build the element
             * 
             * @chainable
             * @returns {MarkdownEditor}
             */
            render: function() {
                
                var updatePreview = $.proxy( this._updatePreview, this ); 
                
                this.$el.addClass( 'md-markdown-editor' );
                this.$textarea = $( '<textarea />' );
                this.$preview = $( '<div class="md-preview" />' );
                
                this.$el.empty();
                
                this.$el.append( this._createColumn( this.$textarea ) )
                    .append( this._createColumn( this.$preview ) ); 
                
                this.$textarea
                    .on( 'input', updatePreview )
                    .on( 'keyup', updatePreview )
                    .on( 'keydown', updatePreview ); 
                
                this.$textarea
                    .keydown( $.proxy( this._textareaBehavior, this ) ); 
                
                return this;
            },
            
            
            /**
             * @returns {String}    returns the unconverted markdown
             */
            getMarkdown: function( ) {
                return  this.$textarea.val();
            },
            
            /**
             * 
             * @returns {String}    The parsed html.
             */
            getHTML: function() {
                return this.$preview.html();
            },
            
            /**
             * @chainable
             * @returns {MarkdownEditor}
             */
            setValue: function( value ) {
                this.$textarea.val( value ); 
                this._updatePreview();
                return this; 
            }
            
        } 
    );
    
    
}));