base('Table 1').select({
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
		let UID = record.get('UsrID');
		let MID = record.get('MsgID');
        console.log('Retrieved', UID, MID);
		this.IDs = IDs.push({uid: `${UID}`, mid: `${MID}`})
		console.log(IDs)
    });
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});

base('Table 1').select({
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
        console.log('Retrieved', record.get('UsrID'), record.get('MsgID'));
    });
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});
