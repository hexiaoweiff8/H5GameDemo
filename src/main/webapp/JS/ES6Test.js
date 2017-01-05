function makeNosise_async(){
	return Q.async(function* (){
		yield shake();
		yield move();
		yield roll();
	});
}