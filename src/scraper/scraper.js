const axios = require('axios');
const cheerio=require('cheerio');
const url=require('url');
const domain = 'https://www.ewg.org'




// Takes substance: string
// Produces {substurl: string, score: number, concerns: string[]} 
/* Sample usage: getInfo( 'methylchloroisothiazolinone').then(ans=>
{console.log("score: " + ans.score+". # of concerns: " + ans.concerns.length + ". URL: " + ans.substurl)});
*/

function getInfo(substance)
{
	const searchurl = 'https://www.ewg.org/skindeep/search/?search='+substance;
	var substurl="";

	var scoreMax=0;
	var scoreMin=0;
	var cancer=0;
	var developmentalToxicity=0;
	var immunotoxicity=0;
	var concerns = [];

	 return axios(searchurl)
		.then(response => {
		const html = response.data;
		const $ = cheerio.load(html);
		
		const linkElement=$('.product-listings').find('a');
		const link = linkElement.attr('href');
		substurl=domain+link;
		//console.log(substurl);
			/*
		const image = $('#mp-tfa-img').find('img');
		console.log(image.attr('src'));
		*/




		var scoreurl="";

		 return axios(substurl)
			.then(substresponse => {
			const substhtml = substresponse.data;
			const $ = cheerio.load(substhtml);
			
			//const scoreImage = $('#about_range').find('img');
			const scoreImage=$(".squircle");
			//console.log(scoreImage.attr('src'))
			scoreurl=domain+(scoreImage.attr('src'));
			const scoreurlobj=new URL(scoreurl);
			const search_params=scoreurlobj.searchParams;
			scoreMax=parseInt(search_params.get('score'));
			scoreMin=parseInt(search_params.get('score_min'));
			//console.log(scoreMax+" "+scoreMin);


		$("html").find('.chemical-concern-table').each(
			function(index, element) {
				if (index > 0)
				{
					$(element).find('tbody > tr > td:first-child').each(
						function (index2, element2)
						{
							concerns.push($(element2).text());
							//console.log($(element2).text());
						})
				}


				/*
				console.log("yeet");
				concerns.push(element.text());
				console.log(element.text());
				*/
			}
		);
				//console.log(concerns.length);

	return {substurl, score: (scoreMax+scoreMin)/2, concerns}
		})

	.catch(console.error);
	// TODO return: score number, breakdown levels, all concern stuff
	})
	.catch(console.error);
}

getInfo( 'water').then(ans=>
{console.log("score: " + ans.score+". # of concerns: " + ans.concerns.length + ". URL: " + ans.substurl)});
