let model = {
  lists: [
    {
      id: 1,
      title: 'List 1',
      items: [
        { id: 1, title: 'Item 1' },
        { id: 2, title: 'Item 2' },
        { id: 3, title: 'Item 3' }
      ]
    },
    {
      id: 2,
      title: 'List 2',
      items: [
        { id: 1, title: 'Item 4' },
        { id: 2, title: 'Item 5' },
        { id: 3, title: 'Item 6' },
        { id: 4, title: 'Item 7' }
      ]
    }
  ]
}

function getNewItemId (items) {
  if (!items || items.length === 0) {
    return 1
  }

  items.sort((x, y) => {
    return x.id - y.id
  })

  return items[items.length - 1].id + 1
}

function createNewItem (list, item) {
  const newItem = { ...item, id: getNewItemId(list.items) }
  list.items.push(newItem)
  return { success: true, newItem }
}

export function getLists () {
  return model.lists.map(list => ({ id: list.id, title: list.title }))
}

export function getListItems (listId) {
  const [ list ] = model.lists.filter(list => list.id === listId)
  if (!list) {
    return []
  }

  return list.items
}

export function addItem (listId, item) {
  const [ list ] = model.lists.filter(list => list.id === listId)
  if (!list) {
    return { success: false, error: 'List not found' }
  }

  return createNewItem(list, item)
}

export function sortItems (listId, ids) {
  const [ list ] = model.lists.filter(list => list.id === listId)
  if (!list) {
    return { success: false, error: 'List not found' }
  }

  list.items = ids.map(id => list.items.find(item => item.id === id))
  return { success: true }
}

export function deleteItem (listId, itemId) {
  const [ list ] = model.lists.filter(list => list.id === listId)
  if (!list) {
    return { success: false, error: 'List not found' }
  }

  list.items = list.items.filter(item => item.id !== itemId)
  return { success: true }
}

export function duplicateItem (listId, itemId) {
  const [ list ] = model.lists.filter(list => list.id === listId)
  if (!list) {
    return { success: false, error: 'List not found' }
  }

  const [ item ] = list.items.filter(item => item.id === itemId)
  if (!item) {
    return { success: false, error: 'Item for duplication not found' }
  }

  return createNewItem(list, item)
}
