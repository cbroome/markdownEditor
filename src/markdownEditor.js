(function (factory) {
if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define( ['jquery'], factory );
} else {
    // No AMD. Register plugin with global jQuery object.
    factory( jQuery );
}
}(function ($) {    
    
    /**
     * @static  
     * @private
     * @var     {Integer}   markdownCounter
     */
    var markdownCounter = 0;
    
    $.fn.markdownEditor = function ( action, options ) { 
        
        var actions = {
            init: $.proxy( $.fn.markdownEditor.init, this ),
            destroy: $.proxy( $.fn.markdownEditor.destroy, this ),
            getHTML: $.proxy( $.fn.markdownEditor.getHTML, this ),
            getMarkdown: $.proxy( $.fn.markdownEditor.getMarkdown, this ), 
            setValue: $.proxy( $.fn.markdownEditor.setValue, this ),
            addButton: $.proxy( $.fn.markdownEditor.addButton, this ),
            addComponent: $.proxy( $.fn.markdownEditor.addComponent, this ),
            getSelection: $.proxy( $.fn.markdownEditor.getSelection, this ),
            insertValueAtCursor: $.proxy( $.fn.markdownEditor.insertValueAtCursor, this )
        };
        
        return actions[ action ]( options );
        
    };  
    
    /**
     * 
     * @param   {*} options
     * @reutrns {MarkdownEditor}
     */
    $.fn.markdownEditor.init = function( options ) {
        var $this = this,
            markdownEditor = new $.fn.markdownEditor.MarkdownEditor( $this, options );
        markdownEditor.render();

        // Make the markdownEditor accessible in a roundabout way
        $this.data( 'markdownEditor', markdownEditor );
        return this;
    };
    
    
    $.fn.markdownEditor.destroy = function() {
        var $this = this;
        $this.data( 'markdownEditor' ).destroy();
        $this.removeData( 'markdownEditor' );
    };
    
    
    /**
     * @returns {String}    The parsed html.
     */
    $.fn.markdownEditor.getHTML = function() {
        var $this = this;
        return $this.data( 'markdownEditor' ).getHTML();
    };
    
    /**
     * @returns {String}    returns the unconverted markdown
     */
    $.fn.markdownEditor.getMarkdown = function() {
        var $this = this;
        return $this.data( 'markdownEditor' ).getMarkdown();
    };
    
    $.fn.markdownEditor.setValue = function( value ) {
        var $this = this;
        console.log( $this.data( 'markdownEditor' ).id );
        $this.data( 'markdownEditor' ).setValue( value );
        return this;
    };
    
    $.fn.markdownEditor.addButton = function( definition ) {
        var $this = this;
        return $this.data( 'markdownEditor' ).addButton( definition ); 
    };
    
    $.fn.markdownEditor.addComponent = function( $component ) {
        var $this = this;
        return $this.data( 'markdownEditor' ).addComponent( $component );
    };
    
    /**
     * @returns {Object}
     */
    $.fn.markdownEditor.getSelection = function( ) {
        var $this = this;
        return $this.data( 'markdownEditor' ).getSelection( );
    };
    
    
    /**
     * 
     * @chainable
     * @returns {markdownEditor}
     */
    $.fn.markdownEditor.insertValueAtCursor = function( value ) {
        var $this = this;
        $this.data( 'markdownEditor' ).insertValueAtCursor( value );
        return $this;
    }
    
    /*
     * 
     * Class
     * 
     */
    
     $.fn.markdownEditor.MarkdownEditor = function( $el, options ) {
        this.setupEl( $el );
        this.setupOptions( options );
        this.initialize( ); 
    };
    
    $.extend( 
         $.fn.markdownEditor.MarkdownEditor.prototype, 
        {
            /**
             * @property    {String}    id
             */
            id: undefined,
            
            /**
             * @property    {jQuery}    $textarea
             */
            $textarea: undefined,
            
            /**
             * @property    {jQuery}    $preview
             */
            $preview: undefined,
            
            /**
             * @property    {jQuery}    $buttonBar
             */
            $buttonBar: undefined,
            
            /**
             * @property    {jQuery}    $el
             */
            $el: undefined,
            
            /**
             * @property    {Object}    options
             */
            options: undefined,
            
            
            _buttonBold: function( text ) {
                text = '**' + text + '**';
                return text;
            },
            
            _buttonItalic: function( text ) {
                text = '*' + text + '*';
                return text;
            },
            
            _buttonUnderline: function( text ) {
                text = '_' + text + '_';
                return text;
            },
            
            
            /**
             * Generic button click, this will call all of the custom
             * functionality
             * 
             * @param   {Function}  functionality
             */
            _buttonClick: function( functionality ) {
                var selection = this.getSelection(), newValue;
                if( functionality ) {
                    newValue = selection.selection;
                    this.insertValueAtCursor( newValue );
                }
            },
            
            /**
             * 
             * @returns {Array} 
             */
            _defaultButtons: function() {
                return [
                    { label: 'B', name: 'bold', functionality: this._buttonBold },
                    { label: 'I', name: 'italic', functionality: this._buttonItalic },
                    { label: 'U', name: 'underline', functionality: this._buttonUnderline }
                ];
            },
            
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
            
            /**
             * 
             * @param   {*}     button
             */
            _buildButton: function( button ) {
                var $button = $( '<button type="button">' + button.label + '</button>' ); 
                functionality = button.functionality;
                if( functionality ) {
                    $button.click( $.proxy( this._buttonClick, this, functionality ) );
                }
                this.$buttonBar.append( $button );
            },
            
            
            _buildButtonBar: function() {
                var buttons = this._defaultButtons(),
                    length = buttons.length,
                    functionality,
                    i;
                
                for( i = 0; i < length; i++ ) {
                    this._buildButton( buttons[ i ] );
                }
            },
            
            
            /**
             * 
             * Public methods
             * 
             */
            
            
            /**
             * @param   {*}     options
             */
            setupOptions: function( options ) {
            
                this.options = {
                    /**
                     * @property    {String} initString     initialValue of the component
                     */
                    initString: undefined,

                    /**
                     * @property    {Object}    markdownAttrs   attributes to apply to the markdownEditor
                     */
                    markdownAttrs: undefined,

                    /**
                     * @property    {Object}    previewAttrs    attributes to apply to the preview window
                     */
                    previewAttrs: undefined
                };
                
                $.extend( this.options, options || {} );
            },
            
            /**
             * @param {jQuery}  $el
             */
            setupEl: function( $el ) {
                this.$el = $el;   
            },
            
            
            initialize: function() {
                this.id = 'md' + ( markdownCounter++ );
                this.options.initString = this.options.initString || decodeURI( this.$el.html() );
            },
            
            
            /**
             * Build the element
             * 
             * @chainable
             * @returns {MarkdownEditor}
             */
            render: function() {
                
                var updatePreview = $.proxy( this._updatePreview, this ),
                    $leftColumn; 
                
                this.$el.addClass( 'md-markdown-editor' );
                this.$textarea = $( '<textarea />' ).val( this.options.initString );
                this.$buttonBar = $( '<div class="md-button-bar" />' );
                this.$preview = $( '<div class="md-preview" />' );
                
                this.$el.empty();
                this._buildButtonBar();
                
                $leftColumn = this._createColumn();
                
                $leftColumn.append( this.$buttonBar );
                $leftColumn.append( this.$textarea );
                
                this.$el.append( $leftColumn )
                    .append( this._createColumn( this.$preview ) ); 
                
                if( this.options.markdownAttrs ) {
                    this.$textarea.attr( this.options.markdownAttrs );
                }
                
                if( this.options.previewAttrs ) {
                    this.$textarea.attr( this.options.previewAttrs );
                }
                
                this.$textarea
                    .on( 'input', updatePreview )
                    .on( 'keyup', updatePreview )
                    .on( 'keydown', updatePreview ); 
                
                this.$textarea
                    .keydown( $.proxy( this._textareaBehavior, this ) ); 
                this._updatePreview();
                return this;
            },
            
            /**
             * Destroy the element
             */
            destroy: function() {
                this.$preview.remove();
                this.$preview = undefined;
                
                this.$textarea.remove();
                this.$textarea = undefined;
                
                this.$el.remove();
                this.$el = undefined;
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
             * @param   {String}    value
             * @returns {MarkdownEditor}
             */
            setValue: function( value ) {
                this.$textarea.val( value ); 
                this._updatePreview();
                return this; 
            },
            
            /**
             * 
             * @chainable
             * @param   {*}     definition
             * @returns {MarkdownEditor}
             */
            addButton: function( definition ) {
                this._buildButton( definition );
                return this;
            },
            
            /**
             * Add a component to the button bar
             * 
             */
            addComponent: function( $component ) {
                this.$buttonBar.append( $component );
            },
            
            /**
             * Get the current selection and cursor positions.
             * 
             */
            getSelection: function() {
                var value, start, end, substring;
                value = this.$textarea.val();
                start = this.$textarea[0].selectionStart;
                end = this.$textarea[0].selectionEnd;
                substring = value.substring( start, end );                
                
                return {
                    start: start,
                    end: end,
                    selection: substring
                };
            },
            
            
            /**
             * This will insert a value at the current cursor position or 
             * replace a section, regardless of what the value is.
             * 
             * @param   {String}    value
             */
            insertValueAtCursor: function( value )  {
                var start, 
                    end, 
                    currentValue, 
                    substring, 
                    newString, 
                    cursorPosition, 
                    selection;
                
                if( value ) {
                
                    currentValue = this.$textarea.val();
                    selection = this.getSelection();
                    start = selection.start;
                    end = selection.end;
                    newString = currentValue.substring( 0, start )
                        + value
                        + currentValue.substring( end, currentValue.length );
                    
                    this.$textarea.val( newString );
                    cursorPosition = start + substring.length;
                    this.$textarea.focus();
                    this.$textarea.each( function( index, textarea ) {
                        textarea.setSelectionRange( cursorPosition, cursorPosition ); 
                    } );
                    this._updatePreview();
                }  
            }
            
        } 
    );
    
    
}));