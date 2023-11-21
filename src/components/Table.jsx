import React, { useState, useMemo } from 'react';

const Table = ({ columns, data, itemsPerPage = 5 }) => {
	const [ currentPage, setCurrentPage ] = useState(1);
	const [ sortConfig, setSortConfig ] = useState({ key: null, direction: 'asc' });
	const [ query, setQuery ] = useState('');
	const [ selected, setSelected ] = useState([]);
	
	const sortedData = useMemo(() => {
		let sortableData = [...data];
		
		if (sortConfig.key) {
			sortableData.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === 'asc' ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === 'asc' ? 1 : -1;
				}
				return 0;
			});
		}
		
		return sortableData;
	}, [data, sortConfig]);
	const searchedData = useMemo(() => {
		return sortedData.filter((row) => {
			return Object.values(row).some((value) =>
				value.toString().toLowerCase().includes(query.toLowerCase())
			);
		});
	}, [sortedData, query]);
	const totalPages = Math.ceil(searchedData.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = searchedData.slice(startIndex, endIndex);
	
	const handleSort = (key) => {
		setSortConfig({
			key,
			direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
		});
	};
	
	const handleSelect = (id) => {
		if (selected.includes(id)) {
			const updatedSelect = selected.filter(item => item !== id);
			setSelected(updatedSelect)
		} else {
			setSelected([...selected, id])
		}
	}
	
	const getColumnLabel = (column) => {
		const sorted = sortConfig.key == column;
		if (column != 'select') {
			const direction = sortConfig.direction == "asc" ? <span>&uarr;</span> : <span> &darr;</span>
			return <div> { column } { sorted && direction }</div>;
		}
	}
	
	return (
		<div>
			<input className="input mb-1" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..."/>
			<table className="mb-1">
				<thead>
					<tr>
						{ columns.map((column, index) => {
							return (
								<th className="uppercase-text clickable" key={index} onClick={() => handleSort(column)}>
									{ getColumnLabel(column) }
								</th>
							)
						})}
					</tr>
				</thead>
				<tbody>
					{ currentData.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{ columns.map((column, columnIndex) => {
								return (
									<td key={columnIndex}>
										{ column != 'select' ? row[column]:
											<input className="clickable" type="checkbox" checked={selected.includes(row['id'])} onChange={() => handleSelect(row['id'])}/>
										}
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
			
			<div className="mb-5">
        <div className="right-element text-small">
          Page {currentPage} of {totalPages} ({data.length} records, {itemsPerPage} records per page)
        </div>
				<div className="left-element">
					<button className="mr-1" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
						Previous
					</button>
					<button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
						Next
					</button>
				</div>
			</div>
			
			<div className="mt-5 text-left">
				{ selected.length ? <h3>Selected Items</h3>: null}
				{ selected.map((id) => {
					return (
						<div className="mb-1">
							{ JSON.stringify(data.filter(item => item.id == id)[0])}
						</div>
					)
				})}
			</div>
		</div>
	);
};

export default Table;
