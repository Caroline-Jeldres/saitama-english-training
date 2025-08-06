import { screen, act } from '@testing-library/react'
import { describe, it } from 'vitest'
import { trans } from '../../../config/i18n'
import { memoryDBFirebase } from '../../mocks/FirestoreMemoryMock'
import { ejecAllMocks, renderAppWithRoute } from '../../helpers'
import store from '../../../redux/store'
import { getWords } from '../../../redux/actions'
import { setGroupHashWordsByNumberWords, setStudiedhashWords } from '../../../redux/config.slice'
ejecAllMocks()

describe('Training', () => {
  beforeAll(async () => {
    await store.dispatch(getWords())
    store.dispatch(setGroupHashWordsByNumberWords(10))
  })

  it('should render training page', () => {
    renderAppWithRoute('/training')
    expect(screen.getByText(memoryDBFirebase.words[0].data().english)).toBeInTheDocument()
    expect(screen.getByText(trans('button.removeStudiedWords'))).toBeInTheDocument()
  })
  it('should display 2 studied words', async () => {
    await act(async () => {
      renderAppWithRoute('/training/group/0/word/1')

      await store.dispatch(getWords())
      store.dispatch(setGroupHashWordsByNumberWords(10))

      const wordIds = memoryDBFirebase.words.map((w: any) => w.id)
      store.dispatch(setStudiedhashWords([wordIds[0], wordIds[1]]))
    })

    const expectedLabel = `${trans('label.nStudiesToday')} 2`
    expect(await screen.findByText(expectedLabel)).toBeInTheDocument()
  })
})
