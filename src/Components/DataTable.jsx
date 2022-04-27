import React from 'react'
import axios from 'axios'
import styles from './Styles/DataTable.css'
import Data from './collection.json';

class DataTable extends React.Component{

	constructor(props) {
		super(props);
		this.previousIndex = 0
		this.nextIndex = 20
		this.indexCount = 20
		this.fromLastPage = false
		this.state = {dataLoaded: false, renderTokenList: []}
		this.tokenList = []

		function num2word(number,decimal){
			number = Math.floor(number).toString()
			if(decimal != true){

				if(number === null | number == 0){
						return ''
				}
				if(number.length === 4){
					return number[0] + '.' + number.substring(1,3) + 'K'
				}
				else if(number.length === 5){
					return number.substring(0,2) + '.' + number.substring(2,4) + 'K'
				}
				else if(number.length === 6){
					return number.substring(0,3) + '.' + number.substring(2,5) + 'K'
				}
				else if(number.length === 7){
					return number[0] + '.' + number.substring(1,3) + 'M'
				}
				else if(number.length === 8){
					return number.substring(0,2) + '.' + number.substring(2,5) + 'M'
				}
				else if(number.length === 9){
					return number.substring(0,3) + '.' + number.substring(3,6) + 'M'
				}
			}
			
			else{
					if(number === null | number == 0){
						return ''
					}
					if(number.length === 3 | number.length === 2 | number.length === 1){
						return number + '%'
					}
					if(number.length === 4){
						return number[0] + '.' + number.substring(1,3) + 'K%'
					}
					else if(number.length === 5){
						return number.substring(0,2) + '.' + number.substring(2,4) + 'K%'
					}
					else if(number.length === 6){
						return number.substring(0,3) + '.' + number.substring(2,5) + 'K%'
					}
					else if(number.length === 7){
						return number[0] + '.' + number.substring(1,3) + 'M%'
					}
					else if(number.length === 8){
						return number.substring(0,2) + '.' + number.substring(2,5) + 'M%'
					}
					else if(number.length === 9){
						return number.substring(0,3) + '.' + number.substring(3,6) + 'M%'
					}
			}
		}

		function num2percent(number){
			if(number === 0 | number === null){
				return ''
			}
			else{
				return number.toFixed(2) + '%'
			}
		}

		function GetSortOrder(prop) {    
		    return function(a, b) {    
		        if (a[prop] > b[prop]) {    
		            return 1;    
		        } else if (a[prop] < b[prop]) {    
		            return -1;    
		        }    
		        return 0;    
		    }    
		}    



		this.tokenList = Data.sort(GetSortOrder('today_yield')).reverse().map((token,index) => {
			
			return(

				token.today_yield !== null ? <tr key = {token.id}>
				<td>
					<div className = "inline">
						<img className = "DataTable image" src = {`https://farm.army${token.icon}`}></img>
					</div>
					<div className = "inline">
						<p>{token.name}</p>
						<a href = {token.provider.url}><p>{token.provider.label}</p></a>
					</div>
				</td>
				<td className="block center">
					{num2word(token.today_tvl)}
				</td>
				<td className="block center">
					{num2word(token.seven_day_tvl)}
				</td>
				<td className="block center">
					{num2word(token.thirty_day_tvl)}
				</td>
				<td className="block center">
					<div>
						{`${num2word(token.today_yield_apy,true)}`}
					</div>
					<div>
						{`${num2percent(token.today_yield)}`}
					</div>
				</td>
				<td className="block center">
					<div>
							{`${num2word(token.seven_day_yield_apy,true)}`}
					</div>
					<div>
							{`${num2percent(token.seven_day_yield)}`}
					</div>
				</td>
				<td className="block center">
					<div>
							{`${num2word(token.thirty_day_yield_apy,true)}`}
					</div>
					<div>
							{`${num2percent(token.thirty_day_yield)}`}
					</div>
				</td>
				<td>
					{
						token.earn.map(value => (

							<a href = {token.link}><img src = {`https://farm.army${value.icon}`}></img></a>

								

							))
					}
				</td>
				<td>
				{
					token.compound === true | token.cryptoLabel.length > 0 ? 
					<div style = {{paddingBottom: '15px'}}>
						{
							token.compound === true ? 

							<div><span className = "info blue">auto compound</span></div> : null
						}
						{
							token.cryptoLabel !== [] ? token.cryptoLabel.map(val => (
								val.label === 'deprecated' | val.label === 'lend' | val.label === 'borrow' ? <div><span className = {`info ${val.label}`}>{val.label}</span></div> : null
							))  : null
						}
						
					</div> : null
				}
					<a className = "center" href = {token.provider.url}><img className = "DataTable image" src = {`https://farm.army${token.provider.icon}`}></img></a>
				</td>
			</tr>
			: null)})

	

			

	}

	componentDidMount(){
		this.setState({renderTokenList: this.tokenList.slice(this.previousIndex,this.nextIndex)})
	}

	previousPage = () => {
		if(this.previousIndex - this.indexCount < 0){
			this.previousIndex = 0
			this.nextIndex = this.indexCount
			this.setState({renderTokenList: this.tokenList.slice(this.previousIndex,this.nextIndex)})
		}
		else{
			if(this.fromLastPage == true){
				this.nextIndex = this.previousIndex
				this.previousIndex -= this.indexCount
				this.fromLastPage = false
				this.setState({renderTokenList: this.tokenList.slice(this.previousIndex,this.nextIndex)})
			}
			else{
				this.previousIndex -= this.indexCount
				this.nextIndex -= this.indexCount
				this.setState({renderTokenList: this.tokenList.slice(this.previousIndex,this.nextIndex)})
		}
		}
	}

	nextPage = () => {
			if(this.nextIndex + this.indexCount > this.tokenList.length){
				if(this.fromLastPage !== true){
					this.previousIndex =  this.nextIndex
					this.nextIndex = this.tokenList.length
					this.fromLastPage = true
					this.setState({renderTokenList: this.tokenList.slice(this.previousIndex,this.nextIndex)})
				}
		}
			else{

				this.previousIndex += this.indexCount
				this.nextIndex += this.indexCount
				this.setState({renderTokenList: this.tokenList.slice(this.previousIndex,this.nextIndex)})
		}
	}

	render(){

		if(this.state.renderTokenList !== true){
			return(

					<div className = "DataTable">

					<div className = "DataTableIconContainer">
						<button className = "dataTableIcon" onClick = {this.previousPage}>
							<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
  							<path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1z"/>
							</svg>
						</button>
						<button className = "dataTableIcon" onClick = {this.nextPage}>
							<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-right-square-fill" viewBox="0 0 16 16">
  							<path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z"/>
							</svg>
						</button>
					</div>
						<div class="table-responsive">
							<table className = "table">
								<thead>
									<tr>

										<th>Name:</th>
										<th className = "center">Today TVL:</th>
										<th className = "center">7d ago TVL:</th>
										<th className = "center">30d ago TVL:</th>
										<th className = "center">Today Yield:</th>
										<th className = "center">7d ago Yield:</th>
										<th className = "center">30d ago Yield:</th>
										<th>Earn:</th>
										<th>Provider:</th>
									</tr>
								</thead>
								<tbody>
									{this.state.renderTokenList}
								</tbody>
							</table>
						</div>

					<div className = "DataTableIconContainer bottom">
						<button className = "dataTableIcon" onClick = {this.previousPage}>
							<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
  							<path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1z"/>
							</svg>
						</button>
						<button className = "dataTableIcon" onClick = {this.nextPage}>
							<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-right-square-fill" viewBox="0 0 16 16">
  							<path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z"/>
							</svg>
						</button>
					</div>



					</div>

				)
		}

		return('Loading...')
	}

}

export default DataTable