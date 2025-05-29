let React = {
    createElement: (tag, props, ...children) => {
        if (typeof tag === 'function') {
            return tag(props);
        }

        const element = {
            tag,
            props: { ...props, children }
        };

        console.log(element);

        return element;
    }
};

const App = () => (
    <div className="work">
        <h2>
            Hello, person
        </h2>
        <p>
            This is a simple React component that demonstrates how to use JSX syntax.
            The component renders a div with a class name of "work", containing a heading and a paragraph.
            You can modify the content as needed to fit your application.
        </p>
    </div>
);

const render = (reactElement, container: HTMLElement) => {
    if (["string", "number"].includes(typeof reactElement)) {
        container.appendChild(
            document.createTextNode(reactElement),
        );

        return;
    }

    const actualDomElement = document.createElement(reactElement.tag);

    if (reactElement.props) {
        Object.keys(reactElement.props)
            .filter(prop => prop !== 'children')
            .forEach(key => {
                actualDomElement[key] = reactElement.props[key];
            });
    }

    if (reactElement.props.children) {
        reactElement.props.children.forEach(child => {
            render(child, actualDomElement);
        });
    }

    container.appendChild(actualDomElement);
}

render(<App/>, document.getElementById('app'));