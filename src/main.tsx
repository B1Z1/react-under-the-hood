let React = {
    createElement: (tag, props, ...children) => {
        if (typeof tag === 'function') {
            try {
                return tag(props);
            } catch ({ promise, key }) {
                promise.then(data => {
                    promiseCache.set(key, data);
                    rerender();
                })
                return { tag: 'div', props: { children: ["I'm loading"] } };
            }
        }

        const element = {
            tag,
            props: { ...props, children }
        };

        console.log(element);

        return element;
    }
};

const states = [];
let stateCursor = 0;

const useState = (initialState) => {
    const FROZEN_CURSOR = stateCursor;

    states[FROZEN_CURSOR] = states[FROZEN_CURSOR] ?? initialState;

    let setState = (newState) => {
        states[FROZEN_CURSOR] = newState;
        rerender();
    };

    stateCursor++;

    return [states[FROZEN_CURSOR], setState];
}

const promiseCache = new Map();

const createResource = (promise: Promise<any>, key: string) => {
    if (promiseCache.has(key)) {
        return promiseCache.get(key);
    }

    throw { promise, key };
}

const App = () => {
    const [name, setName] = useState('World');
    const [count, setCount] = useState(0);
    const dogPhotoUrl = createResource(
        fetch('https://dog.ceo/api/breeds/image/random')
            .then(res => res.json())
            .then(payload => payload.message),
        "dogPhoto"
    );

    return (
        <div className="work">
            <h2>
                Hello, {name}
            </h2>
            <input
                className="input"
                type="text"
                value={name}
                onchange={(e) => setName(e.target.value)}
                placeholder="Type something here..."
            />

            <h2>The count is: {count}</h2>
            <button onclick={() => setCount(count + 1)}>Increase</button>
            <button onclick={() => setCount(count - 1)}>Decrease</button>

            <img src={dogPhotoUrl} alt="Work"/>

            <p>
                This is a simple React component that demonstrates how to use JSX syntax.
                The component renders a div with a class name of "work", containing a heading and a paragraph.
                You can modify the content as needed to fit your application.
            </p>
        </div>
    );
};

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

const rerender = () => {
    stateCursor = 0;

    document.getElementById('app').firstChild?.remove();

    render(<App/>, document.getElementById('app'));
}

render(<App/>, document.getElementById('app'));