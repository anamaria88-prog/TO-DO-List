
$('.new-item').keypress(function(event) {

	if (event.keyCode === 13) {
		const value = $(this).val();
		$(this).val('');

		generateLi(value);
		saveToLocalStorage(value);
	}

	itemsLeft();
})


$('.todo-items').on('mouseover', '.list-item', function() {
	const $parent = $(this).closest('.list-item').find('button')
	$parent.removeClass('show-btn');
})

$('.todo-items').on('mouseout', '.list-item', function() {
	const $parent = $(this).closest('.list-item').find('button')
	$parent.addClass('show-btn');
})

$('.todo-items').on('click', 'input', function() {
	const $parent = $(this).closest('.list-item')
	$parent.toggleClass('completed');

	const index = $parent.index();

	if ($parent.hasClass('completed') ) {
		markAsCompleted(index);
		$('.clear-completed').removeClass('show-btn');

	} else {
		removeCompleted(index);
	}

	itemsLeft();

})

$('.todo-items').on('click', '.delete-item', function() {
	
	const listItemsString = localStorage.getItem('listItems');

	const listItems = JSON.parse(listItemsString);

	const index = $(this).closest('.list-item').index();

	listItems.splice(index, 1);

	localStorage.setItem('listItems', JSON.stringify(listItems));

	$(this).closest('.list-item').remove();

	itemsLeft();
})


function markAsCompleted(index) {

	const listItemsString = localStorage.getItem('listItems')

	const listItems = JSON.parse(listItemsString);

	listItems[index].completed = true;

	localStorage.setItem('listItems', JSON.stringify(listItems))

}


function removeCompleted(index) {

	const listItemsString = localStorage.getItem('listItems')

	const listItems = JSON.parse(listItemsString);

	listItems[index].completed = false;

	localStorage.setItem('listItems', JSON.stringify(listItems))
}


function generateLi(value) {
	const checkbox = 
	'<input type="checkbox" class="input-check checkbox-round" />';
	const deleteBtn = '<button class="delete-item show-btn">x</button>';
	const spanValue = '<span class="span-item">' + value + '</span>';

	const newLi = $('<li />', {
		class: 'list-item',
		html: checkbox + spanValue + deleteBtn 
	})

	$('.todo-items').append(newLi);
	

}


function saveToLocalStorage(value) {

	const listItemsString = localStorage.getItem('listItems')
	let listItems;

	if (listItemsString === null) {
		listItems = [];
	} else {
		listItems = JSON.parse(listItemsString);
	}

	const obj = {
		completed: false,
		text: value,
	}

	listItems.push(obj)

	localStorage.setItem('listItems', JSON.stringify(listItems))
}


function checkExistingItems() {

	const listItemsString = localStorage.getItem('listItems')


	if (listItemsString !== null) {
		const listItems = JSON.parse(listItemsString);

		listItems.forEach(item => {

			generateLi(item.text);

		})
	} 
}

function checkCompletedItems() {
	const listItemsString = localStorage.getItem('listItems')
	

	if (listItemsString === null ) {
		return;
	}

	const listItems = JSON.parse(listItemsString);

	listItems.forEach((item, index) => {

		if (item.completed) {
			$($('.list-item')[index]).addClass('completed');
			$($('.list-item')[index]).find('input').attr('checked', true);
			
		}
	})

	itemsLeft();

}

checkExistingItems();
checkCompletedItems();


$('.main-todo-List').on('click', '.clear-completed', function() {

	const listItemsString = localStorage.getItem('listItems');
	const listItems = JSON.parse(listItemsString);

  	for (let i = listItems.length - 1 ; i >= 0; i-- ) {
  		if (listItems[i].completed === true) {
  			// console.log(listItems[i])
  			// //let a = $($('.list-item')[i]).index()
  			// console.log($($('.list-item')[i]))
  			listItems.splice(i, 1)
  			$($('.list-item')[i]).remove()
  		}
  	}

  	// listItems = listItems.filter(item => !item.completed)

  	// console.log('aici', listItems)


	localStorage.removeItem('completed')

	$('.clear-completed').addClass('show-btn');
	$('.icon').addClass('icon-hover');

	localStorage.setItem('listItems', JSON.stringify(listItems))

	itemsLeft();

})


$('.main-todo-List').on('click', '.active', function() {

	$(".input-check:checked").each(function () {
      	$(this).closest("li").remove(); 	
    })

})


$('.main-todo-List').on('click', '.btn-completed', function() {

	$(".input-check:not(:checked)").each(function() {
		$(this).closest('li').remove();
	})
})


$('.main-todo-List').on('click', '.all', function() {

	location.reload()
})


$('.main-todo-List').on('click', '.icon', function() {
	
	const $checkAll = $('.list-item');

	if ($('.icon').hasClass('icon-hover')) {
		
		$checkAll.addClass('completed')
		$checkAll.find('.input-check').prop('checked', true)
		$('.icon').removeClass('icon-hover')
		$('.clear-completed').removeClass('show-btn')

	} else {

		$checkAll.removeClass('completed')
		$checkAll.find('.input-check').prop('checked', false)
		$('.icon').addClass('icon-hover')
		$('.clear-completed').addClass('show-btn')
	}

	$checkAll.each(function() {

		if ($(this).closest("li").hasClass('completed')) {
		
			markAsCompleted($(this).closest('li').index())
			
		} else {
		
			removeCompleted($(this).closest('li').index())
		
		}
	})

	itemsLeft();
})

function itemsLeft() {
	
	const count = $('.input-check:not(:checked)').length;

	$('.main-todo-List').find('.items-left').text(count)
}
