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
        
        return this.each( function() {    
            var actions = {
                init: $.proxy( $.fn.markdownEditor.init, this ),
                getValue: $.proxy( $.fn.markdownEditor.getValue, this ),
                setValue: $.proxy( $.fn.markdownEditor.setValue, this )
            };
            return actions[ action ]( options );
        } );
        
    };  
    
    
    $.fn.markdownEditor.init = function( options ) {
        var $this = $( this ),
            markdownEditor = new  $.fn.markdownEditor.MarkdownEditor( $this );
        markdownEditor.render();

        // Make the markdownEditor accessible in a roundabout way
        $this.data( 'markdownEditor', markdownEditor );
        return this;
    };
    
    $.fn.markdownEditor.getValue = function() {
        var $this = $( this );
        return $this.data( 'markdownEditor' ).getValue();
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
                this.$preview.html( this.$textarea.val() );            
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
                
                $( this.$textarea )
                    .on( 'keyup', updatePreview )
                    .on( 'keydown', updatePreview ); 
                
                return this;
            },
            
            
            /**
             * @returns {String}
             */
            getValue: function() {
                console.log( 'here ',  this.$textarea.val() );
                return  this.$textarea.val();
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