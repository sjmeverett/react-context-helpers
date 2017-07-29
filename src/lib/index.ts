import * as React from 'react';
import * as PropTypes from 'prop-types';


export class ObservableContext<TContext> {
  private listeners: ((newContext: TContext) => any)[];

  constructor(public value: TContext = null) {
    this.listeners = [];
  }

  subscribe(listener: (newContext: TContext) => any): () => void {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  change(newContext: TContext) {
    this.value = newContext;
    this.listeners.forEach((listener) => listener(newContext));
  }
};

type Component<T> = React.ComponentClass<T> | React.StatelessComponent<T>;

export function contextProvider<TContext>(name: string) {
  return class ContextProvider extends React.Component<TContext, void> {
    observableContext: ObservableContext<TContext>;

    static childContextTypes = {
      [name]: PropTypes.object
    };

    getChildContext() {
      return {
        [name]: this.observableContext
      };
    }

    componentWillMount() {
      this.observableContext = new ObservableContext<TContext>();
    }

    componentWillReceiveProps(nextProps) {
      this.observableContext.change(nextProps);
    }

    render() {
      return React.createElement('div', {children: this.props.children});
    }
  };
};


export function contextConsumer<TContext, TAdditionalProps={}>(name: string) {
  return (Component: Component<TContext & TAdditionalProps>) => {
    return class ContextConsumer extends React.Component<TAdditionalProps, TContext> {
      unsubscribe: () => void;

      constructor(props, context) {
        super(props, context);
        this.state = {} as any;
      }

      componentWillMount() {
        const context: ObservableContext<TContext> = this.context[name];

        if (context) {
          this.unsubscribe = context.subscribe((context) => this.setState(context));
        }
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      }

      render() {
        return React.createElement(Component as any, {
          ...this.state as any,
          ...this.props as any
        });
      }
    };
  };
};
