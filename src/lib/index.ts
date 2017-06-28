import * as _ from 'lodash';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import getDisplayName from 'react-display-name';


export interface ComponentDecorator<TOriginalProps, TOwnProps> {
  (component: React.ComponentClass<TOriginalProps> | React.StatelessComponent<TOriginalProps>): React.ComponentClass<TOwnProps>;
};

//export type Hash = {[key: string]: any};
//export type ContextProps<TContext> = {[K in keyof TContext]: any};

/**
 * 
 * @param contextTypes 
 */
export function contextProvider<TContext, TOriginalProps = {}>(
  contextTypes: PropTypes.ValidationMap<TContext>
): ComponentDecorator<TOriginalProps, TContext & TOriginalProps>;

export function contextProvider<TContext, TOriginalProps = {}>(
  contextTypes: PropTypes.ValidationMap<TContext>,
  passThrough: false
): ComponentDecorator<TOriginalProps, TContext & TOriginalProps>;

export function contextProvider<TContext, TOriginalProps = {}>(
  contextTypes: PropTypes.ValidationMap<TContext>,
  passThrough: true
): ComponentDecorator<TContext & TOriginalProps, TContext & TOriginalProps>;

export function contextProvider<TContext, TOriginalProps = {}, K extends keyof TContext = keyof TContext>(
  contextTypes: PropTypes.ValidationMap<TContext>,
  passThrough: K[]
): ComponentDecorator<TOriginalProps & Pick<TContext, K>, TContext & TOriginalProps>;
/**
 * 
 * @param contextTypes 
 * @param mapPropsToContext 
 */
export function contextProvider<TContext, TOriginalProps, TContextProps>(
  contextTypes: PropTypes.ValidationMap<TContext>,
  mapPropsToContext: (props: TContextProps) => TContext
): ComponentDecorator<TOriginalProps, TContextProps & TOriginalProps>;

export function contextProvider<TContext, TOriginalProps, TContextProps, K extends keyof TContextProps = keyof TContextProps>(
  contextTypes: PropTypes.ValidationMap<TContext>,
  arg2?: boolean | K[] | ((props: TContextProps) => TContext)
) {
  const passThrough = typeof arg2 === 'function' || arg2;
  const mapPropsToContext = typeof arg2 === 'function' && arg2;

  return (Component) => class ContextProvider extends React.Component<any, any> {
    static childContextTypes = contextTypes;
    static displayName = `ContextProvider(${getDisplayName(Component)})`;

    getChildContext() {
      return mapPropsToContext ? mapPropsToContext(this.props) : _.pick(this.props, Object.keys(contextTypes));
    }

    render() {
      const exclude = Array.isArray(passThrough) ? passThrough : [];

      const props = passThrough === true
        ? this.props
        : _.omit(this.props, _.difference(Object.keys(contextTypes), exclude));
      
      return React.createElement(Component, props);
    }
  };
};


/**
 * 
 * @param contextTypes 
 */
export function contextToProps<TContext, TOriginalProps={}>(
  contextTypes: PropTypes.ValidationMap<TContext>
): ComponentDecorator<TOriginalProps & TContext, TOriginalProps>;

/**
 * 
 * @param contextTypes 
 * @param mapContextToProps 
 */
export function contextToProps<TContext, TOriginalProps, TContextProps>(
  contextTypes: PropTypes.ValidationMap<TContext>,
  mapContextToProps: (context: TContext) => TContextProps
): ComponentDecorator<TOriginalProps & TContextProps, TOriginalProps>;

export function contextToProps<TContext, TOriginalProps, TContextProps>(
  contextTypes: PropTypes.ValidationMap<TContext>,
  mapContextToProps?: (context: TContext) => TContextProps
) {

  return (Component) => class WithContext extends React.Component<TOriginalProps, any> {
    static displayName = `WithContext(${getDisplayName(Component)})`;
    static contextTypes = contextTypes;

    render() {
      let context = mapContextToProps
        ? mapContextToProps(this.context)
        : _.pick(this.context, Object.keys(contextTypes));
      
      return React.createElement(Component, {
        ...context,
        ...<any>this.props // https://github.com/Microsoft/TypeScript/issues/10727
      });
    }
  };
};
