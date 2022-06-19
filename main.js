document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#grid')
  const flagsLeft = document.querySelector('#flags-left')
  const result = document.querySelector('#result')
  const restart = document.querySelector('button')
  restart.addEventListener('click', restartGame)
  function restartGame() {
    location.reload(true)
  }
  // restartGame('location.reload(true)')
  let width = 10
  let bombsAmount = 16
  let flags = 0
  let squares = []
  let isGameOver = false

  // Create Board
  function createBoard() {
    flagsLeft.innerHTML = bombsAmount
    // get shuffeled game array with random bombs
    const bombsArray = Array(bombsAmount).fill('bomb')
    const emptyArray = Array(width * width - bombsAmount).fill('valid')
    // join arrays
    const gameArray = emptyArray.concat(bombsArray)
    // mix arrays together randomly using the Fisher Yates Method
    for (let i = gameArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i)
      let k = gameArray[i]
      gameArray[i] = gameArray[j]
      gameArray[j] = k
    }

    // create square div's with id's and add them to the grid and array
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      // give squares a unique id and class name
      square.setAttribute('id', i)
      square.classList.add(gameArray[i])
      grid.appendChild(square)
      squares.push(square)

      // normal click
      square.addEventListener('click', () => click(square))

      // right click - 🚩
      square.oncontextmenu = (e) => {
        e.preventDefault()
        addFlag(square)
      }
    }

    // add numbers to the squares
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      // define left and right edge
      const isLeftEdge = i % width === 0
      const isRightEdge = i % width === width - 1

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++ // west
        if (i > 10 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++ // north west
        if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++ // south west
        if (i > 9 && squares[i - width].classList.contains('bomb')) total++ // north
        if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++ // north east
        if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++ // east
        if (i < 90 && squares[i + width].classList.contains('bomb')) total++ // south
        if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++ // south east

        squares[i].setAttribute('data', total)
      }
    }
  }

  createBoard()

  // add flag with right click
  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked')) {
      if (!square.classList.contains('flagged')) {
        square.classList.add('flagged')
        square.innerHTML = '🚩'
        flags++
        flagsLeft.innerHTML = bombsAmount - flags
        checkForWin()
      } else {
        square.classList.remove('flagged')
        square.innerHTML = ''
        flags--
        flagsLeft.innerHTML = bombsAmount - flags
      }
    }
  }

  // click on square actions
  function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flagged')) return
    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      let total = square.getAttribute('data')
      if (total != 0) {
        square.classList.add('checked')
        if (parseInt(total) === 1) square.classList.add('number', 'one')
        if (parseInt(total) === 2) square.classList.add('number', 'two')
        if (parseInt(total) === 3) square.classList.add('number', 'three')
        if (parseInt(total) === 4) square.classList.add('number', 'four')
        if (parseInt(total) === 5) square.classList.add('number', 'five')
        if (parseInt(total) === 6) square.classList.add('number', 'six')
        if (parseInt(total) === 7) square.classList.add('number', 'seven')
        if (parseInt(total) === 8) square.classList.add('number', 'eight')

        square.innerHTML = total
        square.style.border = '1px solid white'
        square.style.borderRadius = '0px'

        return
      }
      square.classList.add('checked')
      square.style.border = '1px solid white'
      square.style.borderRadius = '0px'
      checkSquare(square, currentId) // only invoked if data label is 0
    }
  }

  // check neighbouring squares once square is clicked - recursion
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0
    const isRightEdge = currentId % width === width - 1

    setTimeout(() => {
      // west
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id
        // const newId = parseInt(currentId) - 1
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      // north west
      if (currentId > 10 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      // south west
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      // north
      if (currentId > 10) {
        const newId = squares[parseInt(currentId) - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      // north east
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      // east
      if (currentId < 99 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      // south
      if (currentId < 90) {
        const newId = squares[parseInt(currentId) + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      // south east
      if (currentId < 90 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }
  // game over
  function gameOver(square) {
    isGameOver = true
    // show all bomb locations
    squares.forEach((square) => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
        square.style.border = '1px solid grey'
        square.style.backgroundColor = 'rgb(233, 234, 233)'
      }
    })
    result.innerHTML = 'BOOM! Game over'
  }

  // check for a win
  function checkForWin() {
    let matches = 0
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flagged') && squares[i].classList.contains('bomb')) {
        matches++
      }
      if (matches === bombsAmount) {
        result.innerHTML = 'Congratulations, you won!'
      }
    }
  }
})
