import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { div, h4, a, span } from '@cycle/dom'
import {
  OPEN_MODAL,
  CLOSE_MODAL
} from '../constants'

function intent (DOM, OpenModal) {
  return xs.merge(
    DOM.select('.close-button').events('click')
      .mapTo({ type: CLOSE_MODAL }),
    OpenModal,
    OpenModal.map(x => x.component.CloseModal).flatten()
  )
}

function model (action$) {
  const open$ = action$
    .filter(action => action.type === OPEN_MODAL)
    .map(action => xs.combine(action.component.DOM, xs.of(action.title)))
    .flatten()

  // need to delay this stream for a milisec because the interaction
  // with any element from nested component would always trigger the
  // component's DOM stream to emit - so if a DOM-related stream in nested
  // component emitted `CLOSE_MODAL` action, both open$ and close$
  // streams would emit. Because of that delaying the close$ stream
  // would always make it emit after the open$ stream resulting
  // in successfully closed modal.
  const close$ = action$
    .filter(action => action.type === CLOSE_MODAL)
    .mapTo(null)
    .compose(delay(1))

  return xs.merge(open$, close$)
    .startWith(null)
}

function view (state$) {
  return state$.map(state => {
    if (!state) {
      return span()
    }

    const [ component, title ] = state
    return div('', [
      div(`.modal`, [
        div('.modal-dialog', [
          div('.modal-content', [
            div('.modal-header', [
              div('.pull-left', [h4('', title)]),
              div('.pull-right', [
                a(`.close-button`, 'X')
              ]),
              div('.clearfix')
            ]),
            div('.modal-body', [
              component
            ]),
            div('.modal-footer', [])
          ])
        ])
      ]),
      div('.modal-backdrop .fade .in')
    ])
  })
}

export default function ModalDialog (sources) {
  const action$ = intent(sources.DOM, sources.OpenModal)
  const state$ = model(action$)
  const vtree$ = view(state$)

  return {
    DOM: vtree$
  }
}
