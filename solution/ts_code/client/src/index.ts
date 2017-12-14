import Foo from './foo'
import Bar from './bar'

// see if refresh
// for compatibility with legacy js
(<any>window).foobar = () => {
  const foo = new Foo()
  const bar = new Bar()
  const a = 1
  const b = 2
  return bar.bar(foo.add(a, b))
}
