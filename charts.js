document.addEventListener("DOMContentLoaded", function() {

    const mockData = [];
    
    const programs = [
        { code: "BACOMM", count: 1 }, { code: "BMMA", count: 10 },
        { code: "BSA", count: 1 }, { code: "BSAIS", count: 2 },
        { code: "BSBA-OM", count: 7 }, { code: "BSCpE", count: 5 },
        { code: "BSHM", count: 25 }, { code: "BSIT", count: 21 },
        { code: "BSTM", count: 24 }
    ];

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const modes = ["Public Transport", "Public Transport", "Car", "Motorcycle", "Walking"];
    const trafficLevels = ["Light", "Moderate", "Heavy"]; 

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    
    function getCommuteTime(traffic) {
        let base = 15 + Math.random() * 25;
        if (traffic === "Moderate") base += 15;
        if (traffic === "Heavy") base += 30;
        return Math.round(base);
    }

    programs.forEach(prog => {
        for(let i=0; i < prog.count; i++) {
            let traffic = pick(trafficLevels);
            let time = getCommuteTime(traffic);
            let isLate = time > 60; 
            
            mockData.push({
                program: prog.code, day: pick(days), transport: pick(modes),
                traffic: traffic, time: time,
                attendance: isLate ? "Late" : "On Time"
            });
        }
    });

    function updateDashboard() {
        const selDay = document.getElementById('filterDay').value;
        const selMode = document.getElementById('filterMode').value;
        const selTraffic = document.getElementById('filterTraffic').value;
        const selProgram = document.getElementById('filterProgram').value;

        const filtered = mockData.filter(d => {
            return (selDay === "All" || d.day === selDay) &&
                   (selMode === "All" || d.transport === selMode) &&
                   (selTraffic === "All" || d.traffic === selTraffic) &&
                   (selProgram === "All" || d.program === selProgram);
        });

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const commuteByDay = [0,0,0,0,0];
        const countByDay = [0,0,0,0,0];
        const trafficByDay = [0,0,0,0,0]; 

        filtered.forEach(d => {
            let idx = daysOfWeek.indexOf(d.day);
            if(idx > -1) {
                commuteByDay[idx] += d.time;
                countByDay[idx]++;
                trafficByDay[idx]++;
            }
        });

        const levels = ['Light', 'Moderate', 'Heavy'];
        const attRates = levels.map(lvl => {
            const subset = filtered.filter(d => d.traffic === lvl);
            
            if(subset.length === 0) return 0;
            
            const onTime = subset.filter(d => d.attendance === "On Time").length;
            return Math.round((onTime / subset.length) * 100);
        });

        if(filtered.length > 0) {
            const totalTime = filtered.reduce((acc, d) => acc + d.time, 0);
            const avgTime = Math.round(totalTime / filtered.length);
            document.getElementById('summaryAvgCommute').innerText = avgTime + " Mins";
            
            const totalOnTime = filtered.filter(d => d.attendance === "On Time").length;
            const totalAtt = Math.round((totalOnTime / filtered.length) * 100);
            document.getElementById('summaryAttendance').innerText = totalAtt + "%";

            const avgDelay = Math.round(avgTime * 0.25); 
            document.getElementById('summaryAvgDelay').innerText = avgDelay + " Mins";
        } else {
            document.getElementById('summaryAvgCommute').innerText = "-";
            document.getElementById('summaryAvgDelay').innerText = "-";
            document.getElementById('summaryAttendance').innerText = "-";
        }

        const avgCommute = commuteByDay.map((t, i) => countByDay[i] > 0 ? Math.round(t/countByDay[i]) : 0);
        const barIds = ['barMon', 'barTue', 'barWed', 'barThu', 'barFri'];
        
        avgCommute.forEach((val, i) => {
            let h = (val / 120) * 100; 
            if(h > 100) h = 100;
            const bar = document.getElementById(barIds[i]);
            if(bar) {
                bar.style.height = h + "%";

                if (h > 15) {
                    bar.innerText = val;
                    bar.style.color = "#0f172a";
                } else {
                    bar.innerText = "";
                }
            }
        });

        const volIds = ['volMon', 'volTue', 'volWed', 'volThu', 'volFri'];
        trafficByDay.forEach((val, i) => {
            let h = (val / 25) * 100;
            if(h > 100) h = 100;
            const bar = document.getElementById(volIds[i]);
            if(bar) {
                bar.style.height = h + "%";
                if (h > 15) {
                    bar.innerText = val;
                } else {
                    bar.innerText = "";
                }
            }
        });

        const attIds = ['attLight', 'attMod', 'attHeavy'];
        attRates.forEach((val, i) => {
            const el = document.getElementById(attIds[i]);
            if (el) {
                const displayWidth = val < 5 && val > 0 ? 5 : val;
                el.style.width = displayWidth + "%";
                el.innerText = val + "%";
            }
        });

        document.getElementById('kpiTotalStudents').innerText = filtered.length;
        const overallAvg = filtered.length > 0 ? Math.round(filtered.reduce((s,d)=>s+d.time,0)/filtered.length) : '-';
        document.getElementById('kpiOverallCommute').innerText = overallAvg + " Mins";
        
        let maxTraffic = 0;
        let peakDay = 'None';
        trafficByDay.forEach((val, i) => { 
            if(val > maxTraffic) { 
                maxTraffic = val; 
                peakDay = daysOfWeek[i]; 
            } 
        });
        document.getElementById('kpiPeakTraffic').innerText = peakDay;
    }

    document.getElementById('filterDay').addEventListener('change', updateDashboard);
    document.getElementById('filterMode').addEventListener('change', updateDashboard);
    document.getElementById('filterTraffic').addEventListener('change', updateDashboard);
    document.getElementById('filterProgram').addEventListener('change', updateDashboard);
    
    document.getElementById('resetBtn').addEventListener('click', function() {
        document.getElementById('filterDay').value = "All";
        document.getElementById('filterMode').value = "All";
        document.getElementById('filterTraffic').value = "All";
        document.getElementById('filterProgram').value = "All";
        updateDashboard();
    });

    updateDashboard();

    const locations = ["Centro Escolar University", "Malolos Crossing", "Bulacan State University", "Robinsons Malolos", "Xentro Mall Area"];
    const statuses = ["Medium Traffic", "Heavy Traffic", "Light Traffic", "Standstill", "Construction area"];

    function showNotification() {
        const notifBox = document.getElementById('trafficNotification');
        const title = document.getElementById('notifTitle');
        const msg = document.getElementById('notifMessage');

        if(notifBox && title && msg) {
            const loc = locations[Math.floor(Math.random() * locations.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            title.innerText = "Traffic Alert: " + loc;
            msg.innerText = status + " reported in this area.";
            
            notifBox.classList.add('show');
            setTimeout(() => { notifBox.classList.remove('show'); }, 5000);
        }
    }
    setInterval(showNotification, 15000);
    setTimeout(showNotification, 2000);

    document.getElementById('exportBtn').addEventListener('click', function() {
        const selDay = document.getElementById('filterDay').value;
        const selMode = document.getElementById('filterMode').value;
        const selTraffic = document.getElementById('filterTraffic').value;
        const selProgram = document.getElementById('filterProgram').value;

        const exportData = mockData.filter(d => {
            return (selDay === "All" || d.day === selDay) &&
                   (selMode === "All" || d.transport === selMode) &&
                   (selTraffic === "All" || d.traffic === selTraffic) &&
                   (selProgram === "All" || d.program === selProgram);
        });

        if (exportData.length === 0) {
            alert("No data to export.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Program,Day,Transport Mode,Traffic Level,Commute Time (Mins),Attendance Status\n"; 

        exportData.forEach(row => {
            let rowString = `${row.program},${row.day},${row.transport},${row.traffic},${row.time},${row.attendance}`;
            csvContent += rowString + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        const date = new Date();
        const timestamp = date.toISOString().slice(0,10);
        link.setAttribute("download", `STI_Traffic_Data_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

});