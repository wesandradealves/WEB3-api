wp.blocks.registerBlockType('custom/hero', {
    title: 'Hero',
    icon: 'admin-customizer',
    category: 'common',
    attributes: {
        id: {
            type: 'string',
            default: 'hero-' + Math.random().toString(36).substring(2, 15),
        },
        content: {
            type: 'string',
            default: 'Welcome to the Hero Section!',
        },
    },
    edit: ({ attributes, setAttributes }) => {
        return wp.element.createElement(
            'div',
            { className: 'hero-block', id: attributes.id },  // Use the id attribute here
            wp.element.createElement('input', {
                type: 'text',
                value: attributes.content,
                onChange: (event) => setAttributes({ content: event.target.value }),
                style: { width: '100%', fontSize: '24px', padding: '10px' }
            }),
            wp.element.createElement('div', null, 
                wp.element.createElement('label', null, 'Block ID:'),
                wp.element.createElement('input', {
                    type: 'text',
                    value: attributes.id,
                    onChange: (event) => setAttributes({ id: event.target.value }),  // Allow changing the ID
                    style: { width: '100%', fontSize: '14px', padding: '5px', marginTop: '10px' }
                })
            )
        );
    },
    save: ({ attributes }) => {
        return wp.element.createElement('div', { className: 'hero-block', id: attributes.id },  // Use the id attribute here
            wp.element.createElement('h2', null, attributes.content)
        );
    }
});
