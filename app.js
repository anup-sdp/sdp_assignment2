//alert("sdp assignment 2");

let allDrinks = [];
let cartGroup = [];

function showDrinksCards(){
	const searchResults  = document.getElementById("searchResults");
	searchResults.innerHTML="";
	allDrinks.forEach(e=> {
		let div = document.createElement("div");
		div.classList += ("col-sm-12 col-md-6 col-lg-4 mb-3");				
		div.innerHTML = `					
			<div class="card product-card">
				<img src="${e["strDrinkThumb"]}" alt="drink-pic">
				<p>name: "${e["strDrink"]}"</p>
				<p>category: "${e["strCategory"]}"</p>
				<p>instruction: "${e["strInstructions"]?.slice(0,15)+"..."}"</p>
				<div class="btn-group">
					<button id="addToGroup-btn" type="button" class="btn btn-outline-primary">Add to Group</button>
					<button id="details-btn" type="button" class="btn btn-outline-primary">Details</button>
				</div>
			</div>
		`;
		div.querySelector("#addToGroup-btn").addEventListener("click", ()=>{
			//addToGroup(e["idDrink"], e["strDrink"]);
			addToGroup(e);
		});
		div.querySelector("#details-btn").addEventListener("click", ()=>{
			showDrinkDetails(e["idDrink"]);
		});
		searchResults.appendChild(div);
	});
}


function initialDrinks(){
	//const defaultDrinksUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink";
	//const defaultDrinksUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic"; 
	// www.thecocktaildb.com/api/json/v1/1/search.php?f=a // set as initial drinks
	fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a").then(res=> res.json()).then(data=>{
		//console.log(data);			
		allDrinks = data["drinks"];
		console.log(allDrinks);			
		if(data["drinks"]==null){
			console.log("No drinks found!");
			document.getElementById("searchResults").innerHTML="<p>No drinks found for this search!</p>";
			return;
		}	
		showDrinksCards();
	}).catch((err)=>{
		console.log(err);
	});
}

initialDrinks();


function addToGroup(elem){
	const drinkItem = cartGroup.find(item => item.idDrink == elem.idDrink);
	if(drinkItem){
		alert("item already exists in Group");
		return;
	}
	else if(cartGroup.length>=7){
		alert("can't add more than 7 items to Group");
		return;
	}
	else{
		cartGroup.push({...elem}); // ---
		showDrinkGroup();
	}
}

function showDrinkDetails(drinkId){
	// search full cocktail details by id
	const drinkUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`; 
	fetch(drinkUrl).then(res=> res.json()).then(data=>{
		//console.log(data);			
		let drink = data["drinks"];
		console.log(drink);
		if(data["drinks"]==null){
			console.log("No drinks found by this id!");
			//document.getElementById("searchResults").innerHTML="<p>No drinks found for this search!</p>";
			return;
		}	
		showModal(drink[0]);
	}).catch((err)=>{
		console.log(err);
	});
}

function showModal(drink){	
	let modalBody = document.getElementById("modal-body");
	modalBody.innerHTML = `
		<img src="${drink.strDrinkThumb}" alt="drink-pic"> 
		<p>Drink id: ${drink.idDrink}</p>
		<p>name: ${drink.strDrink}</p>		
		<p>category: ${drink.strCategory}</p>
		<p>alcoholic: ${drink.strAlcoholic}</p>
		<p>instructions: ${drink.strInstructions}</p>
	`; // alternate format: drink["strInstructions"]
	let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
	myModal.show();	
}

function showDrinkGroup(){
	let groupList = document.getElementById("group-list");
	let groupListCount = document.getElementById("group-list-count");
	groupList.innerHTML="";
	cartGroup.forEach((e,idx)=>{
		let div = document.createElement("div");
		div.classList+=("card d-flex flex-row mb-1 p-1");
		div.innerHTML= `
			<span class="badge text-bg-secondary">${idx+1}</span>
			<img src="${e["strDrinkThumb"]}" alt="image">
			<div>
				<p>name: ${e.strDrink}</p>
				<p>id: ${e.idDrink}</p>
			</div>
		`;
		groupList.appendChild(div);
		groupListCount.innerHTML = `<h5>Group List: (${cartGroup.length})</h5>`;
	});	
}


document.getElementById('searchButton').addEventListener('click', function(){
	const searchText = document.getElementById('searchInput').value.trim();
	if (searchText == '') {return;}	
	if(searchText.length==1){
		fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${searchText}`).then(res=> res.json()).then(data=>{ // search by first letter
			//console.log(data);			
			allDrinks = data["drinks"];
			console.log(allDrinks);			
			if(data["drinks"]==null){
				console.log("No drinks found for search.");
				document.getElementById("searchResults").innerHTML="<p>No drinks found for this search!</p>";
				return;
			}	
			showDrinksCards();
		}).catch((err)=>{
			console.log(err);
		});
	}
	else{
		fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`).then(res=> res.json()).then(data=>{ // Search cocktail by name, strIngredient
			//console.log(data);			
			allDrinks = data["drinks"];
			console.log(allDrinks);			
			if(data["drinks"]==null){
				console.log("No drinks found!");
				document.getElementById("searchResults").innerHTML="<p>No drinks found for this search!</p>";
				return;
			}	
			showDrinksCards();
		}).catch((err)=>{
			console.log(err);
		});
	}	
});