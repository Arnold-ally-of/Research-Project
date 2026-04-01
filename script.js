// ============================================================
// DATA & USER MANAGEMENT
// ============================================================

// User Database: 10 members with roles (Admin: 2, Treasurer: 1, Secretary: 1, Member: 6)
const USERS_DATABASE = [
    { id: 1, username: 'admin1', password: 'password', name: 'Alice Johnson', role: 'admin' },
    { id: 2, username: 'admin2', password: 'password', name: 'Bob Peters', role: 'admin' },
    { id: 3, username: 'treasurer1', password: 'password', name: 'Carol Smith', role: 'treasurer' },
    { id: 4, username: 'secretary1', password: 'password', name: 'Diana Wong', role: 'secretary' },
    { id: 5, username: 'member1', password: 'password', name: 'Edward Brown', role: 'member' },
    { id: 6, username: 'member2', password: 'password', name: 'Fiona Green', role: 'member' },
    { id: 7, username: 'member3', password: 'password', name: 'George Miller', role: 'member' },
    { id: 8, username: 'member4', password: 'password', name: 'Hannah Davis', role: 'member' },
    { id: 9, username: 'member5', password: 'password', name: 'Iris Taylor', role: 'member' },
    { id: 10, username: 'member6', password: 'password', name: 'Jack Wilson', role: 'member' }
];

// Current Session
let currentUser = null;

// Group Data
const groupData = {
    name: 'PIX CHAMA',
    currency: 'KSH',
    founded: '2023-01-15',
    memberCount: 10,
    totalMoney: 450000, // Initial total in KSH
    objective: 'A collaborative investment group focused on pooling resources and making strategic investments to maximize returns and build collective wealth.',
    nextMeeting: '2026-04-15',
    members: USERS_DATABASE.map(u => ({ ...u }))
};

// Financial Data: Member Contributions
const financialData = {
    contributions: [
        { memberId: 1, memberName: 'Alice Johnson', amount: 50000, date: '2026-03-01' },
        { memberId: 2, memberName: 'Bob Peters', amount: 45000, date: '2026-03-01' },
        { memberId: 3, memberName: 'Carol Smith', amount: 55000, date: '2026-03-02' },
        { memberId: 4, memberName: 'Diana Wong', amount: 40000, date: '2026-03-02' },
        { memberId: 5, memberName: 'Edward Brown', amount: 35000, date: '2026-03-03' },
        { memberId: 6, memberName: 'Fiona Green', amount: 38000, date: '2026-03-03' },
        { memberId: 7, memberName: 'George Miller', amount: 42000, date: '2026-03-04' },
        { memberId: 8, memberName: 'Hannah Davis', amount: 40000, date: '2026-03-04' },
        { memberId: 9, memberName: 'Iris Taylor', amount: 35000, date: '2026-03-05' },
        { memberId: 10, memberName: 'Jack Wilson', amount: 35000, date: '2026-03-05' }
    ]
};

// Minutes Data
const minutesData = {
    records: [
        { 
            date: '2026-03-15', 
            topics: 'Quarterly review, Q2 investment strategy planning', 
            actionItems: 'Finalize investment portfolio by March 31; Schedule Q2 planning meeting' 
        }
    ]
};

// ============================================================
// AUTHENTICATION SYSTEM
// ============================================================

function authenticateUser(username, password) {
    const user = USERS_DATABASE.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = { ...user };
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    showPublicPage();
}

function isLoggedIn() {
    return currentUser !== null;
}

function getCurrentUserRole() {
    return currentUser ? currentUser.role : null;
}

function canAccessPage(pageName, userRole) {
    const accessMatrix = {
        'general-info': ['public', 'member', 'secretary', 'treasurer', 'admin'],
        'contact': ['public', 'member', 'secretary', 'treasurer', 'admin'],
        'minutes': ['member', 'secretary', 'treasurer', 'admin'],
        'projects': ['member', 'secretary', 'treasurer', 'admin'],
        'roles': ['member', 'secretary', 'treasurer', 'admin'],
        'contributions': ['treasurer', 'admin'],
        'member-management': ['admin']
    };

    if (!userRole) userRole = 'public';
    return accessMatrix[pageName] && accessMatrix[pageName].includes(userRole);
}

function canEditMinutes(userRole) {
    return userRole === 'secretary' || userRole === 'admin';
}

function canEditContributions(userRole) {
    return userRole === 'treasurer';
}

// ============================================================
// UI DISPLAY FUNCTIONS
// ============================================================

function showPublicPage() {
    document.getElementById('publicPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginModal').style.display = 'none';
    renderPublicPage('general-info');
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function showMainApp() {
    document.getElementById('publicPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    document.getElementById('loginModal').style.display = 'none';
    updateUserDisplay();
    buildNavigation();
    renderPage('general-info');
}

function updateUserDisplay() {
    const displayName = currentUser ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : '';
    document.getElementById('userDisplayName').textContent = displayName;
}

// ============================================================
// NAVIGATION BUILDER
// ============================================================

function buildNavigation() {
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = '';

    const navItems = [];

    // Public pages (always visible when logged in)
    navItems.push({ label: 'General Info', page: 'general-info' });
    navItems.push({ label: 'Contact', page: 'contact' });

    // Member and above pages
    if (currentUser && ['member', 'secretary', 'treasurer', 'admin'].includes(currentUser.role)) {
        navItems.push({ label: 'Minutes', page: 'minutes' });
        navItems.push({ label: 'Projects', page: 'projects' });
        navItems.push({ label: 'Roles', page: 'roles' });
    }

    // Treasurer and Admin pages
    if (currentUser && ['treasurer', 'admin'].includes(currentUser.role)) {
        navItems.push({ label: 'Contributions', page: 'contributions' });
    }

    // Admin only pages
    if (currentUser && currentUser.role === 'admin') {
        navItems.push({ label: 'Member Management', page: 'member-management' });
    }

    navItems.forEach(item => {
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'nav-link';
        link.textContent = item.label;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            renderPage(item.page);
        });
        navbar.appendChild(link);
    });
}

// ============================================================
// PAGE ROUTING & RENDERING (PUBLIC)
// ============================================================

function renderPublicPage(pageName) {
    const pageContainer = document.getElementById('publicPageContainer');
    pageContainer.innerHTML = '';

    switch (pageName) {
        case 'general-info':
            renderGeneralInfoPage(pageContainer);
            break;
        case 'contact':
            renderContactPage(pageContainer);
            break;
        default:
            renderGeneralInfoPage(pageContainer);
    }
}

// ============================================================
// PAGE ROUTING & RENDERING
// ============================================================

function renderPage(pageName) {
    const userRole = getCurrentUserRole() || 'public';

    // Check access permission
    if (!canAccessPage(pageName, userRole)) {
        alert('Access Denied: You do not have permission to view this page.');
        renderPage('general-info');
        return;
    }

    const pageContainer = document.getElementById('pageContainer');
    pageContainer.innerHTML = '';

    switch (pageName) {
        case 'general-info':
            renderGeneralInfoPage(pageContainer);
            break;
        case 'contact':
            renderContactPage(pageContainer);
            break;
        case 'minutes':
            renderMinutesPage(pageContainer);
            break;
        case 'projects':
            renderProjectsPage(pageContainer);
            break;
        case 'roles':
            renderRolesPage(pageContainer);
            break;
        case 'contributions':
            renderContributionsPage(pageContainer);
            break;
        case 'member-management':
            renderMemberManagementPage(pageContainer);
            break;
        default:
            renderGeneralInfoPage(pageContainer);
    }
}

// ============================================================
// PAGE COMPONENTS
// ============================================================

function renderGeneralInfoPage(container) {
    container.innerHTML = `
        <div class="page-card">
            <h2>General Information</h2>
            <div class="info-section">
                <h3>${groupData.name}</h3>
                <p class="objective">${groupData.objective}</p>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Total Members</label>
                        <p class="info-value">${groupData.memberCount}</p>
                    </div>
                    <div class="info-item">
                        <label>Founded</label>
                        <p class="info-value">${formatDate(groupData.founded)}</p>
                    </div>
                    <div class="info-item">
                        <label>Next Meeting</label>
                        <p class="info-value">${formatDate(groupData.nextMeeting)}</p>
                    </div>
                    <div class="info-item">
                        <label>Currency</label>
                        <p class="info-value">${groupData.currency}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderContactPage(container) {
    container.innerHTML = `
        <div class="page-card">
            <h2>Contact Information</h2>
            <div class="contact-info">
                <div class="contact-section">
                    <h3>Leadership Contacts</h3>
                    <div class="contact-list">
                        ${groupData.members.filter(m => ['admin', 'treasurer', 'secretary'].includes(m.role)).map(member => `
                            <div class="contact-item">
                                <strong>${member.name}</strong>
                                <span class="role-badge role-${member.role}">${member.role.toUpperCase()}</span>
                                <p>Email: ${member.name.toLowerCase().replace(' ', '.')}@pixchama.local</p>
                                <p>Phone: +254 7${String(member.id).padStart(2, '0')} XXX XXXX</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="contact-section">
                    <h3>Group Communication</h3>
                    <p><strong>Meeting Schedule:</strong> First Tuesday of every month at 6:00 PM</p>
                    <p><strong>Communication Channel:</strong> WhatsApp Group: PIX CHAMA Investors</p>
                    <p><strong>Email:</strong> admin@pixchama.local</p>
                </div>
            </div>
        </div>
    `;
}

function renderMinutesPage(container) {
    const isEditable = canEditMinutes(currentUser.role);
    
    let html = `
        <div class="page-card">
            <h2>Meeting Minutes</h2>
    `;

    if (isEditable) {
        html += `
            <div class="minutes-editor">
                <h3>Record Meeting Minutes</h3>
                <form id="minutesForm" class="form-grid">
                    <div class="form-group">
                        <label for="minutesDate">Meeting Date</label>
                        <input type="date" id="minutesDate" name="minutesDate" required>
                    </div>
                    <div class="form-group">
                        <label for="minutesTopics">Topics Discussed</label>
                        <textarea id="minutesTopics" name="minutesTopics" rows="4" placeholder="List main discussion topics..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="minutesActionItems">Action Items</label>
                        <textarea id="minutesActionItems" name="minutesActionItems" rows="4" placeholder="List action items and responsible parties..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Minutes</button>
                </form>
            </div>
        `;
    }

    html += `
        <div class="minutes-history">
            <h3>Meeting History</h3>
            ${minutesData.records.length === 0 ? '<p>No meeting minutes recorded yet.</p>' : ''}
            ${minutesData.records.map((record, idx) => `
                <div class="minute-record">
                    <div class="minute-header">
                        <h4>Meeting: ${formatDate(record.date)}</h4>
                    </div>
                    <div class="minute-content">
                        <p><strong>Topics:</strong> ${record.topics}</p>
                        <p><strong>Action Items:</strong> ${record.actionItems}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    `;

    container.innerHTML = html;

    if (isEditable) {
        document.getElementById('minutesForm').addEventListener('submit', handleMinutesSave);
    }
}

function renderProjectsPage(container) {
    container.innerHTML = `
        <div class="page-card">
            <h2>Projects & Financial Overview</h2>
            <div class="financial-banner">
                <h3>Total Group Assets</h3>
                <p class="total-money">${formatCurrency(groupData.totalMoney)}</p>
            </div>
            <div class="projects-section">
                <h3>Active Projects</h3>
                <div class="projects-grid">
                    <div class="project-card">
                        <h4>Real Estate Investment</h4>
                        <p>Commercial property development in Nairobi CBD</p>
                        <div class="project-status">
                            <span class="badge badge-active">Active</span>
                            <span class="progress">40% funded</span>
                        </div>
                    </div>
                    <div class="project-card">
                        <h4>Agricultural Development</h4>
                        <p>Coffee farm expansion in Central Kenya region</p>
                        <div class="project-status">
                            <span class="badge badge-active">Active</span>
                            <span class="progress">75% funded</span>
                        </div>
                    </div>
                    <div class="project-card">
                        <h4>Tech Startup Investment</h4>
                        <p>FinTech platform for mobile money solutions</p>
                        <div class="project-status">
                            <span class="badge badge-planning">Planning</span>
                            <span class="progress">20% funded</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderRolesPage(container) {
    container.innerHTML = `
        <div class="page-card">
            <h2>Member Roles & Responsibilities</h2>
            <div class="roles-section">
                <h3>Current Role Assignments</h3>
                <div class="role-assignments">
                    ${groupData.members.map(member => `
                        <div class="member-role-item">
                            <span class="member-name">${member.name}</span>
                            <span class="role-badge role-${member.role}">${member.role.toUpperCase()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="roles-section">
                <h3>Role Permissions</h3>
                <table class="permissions-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Member</th>
                            <th>Secretary</th>
                            <th>Treasurer</th>
                            <th>Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>View General Info</strong></td>
                            <td class="check">✓</td>
                            <td class="check">✓</td>
                            <td class="check">✓</td>
                            <td class="check">✓</td>
                        </tr>
                        <tr>
                            <td><strong>View Minutes</strong></td>
                            <td class="check">✓</td>
                            <td class="check">✓</td>
                            <td class="check">✓</td>
                            <td class="check">✓</td>
                        </tr>
                        <tr>
                            <td><strong>Edit Minutes</strong></td>
                            <td class="cross">✗</td>
                            <td class="check">✓</td>
                            <td class="cross">✗</td>
                            <td class="cross">✗</td>
                        </tr>
                        <tr>
                            <td><strong>View Contributions</strong></td>
                            <td class="cross">✗</td>
                            <td class="cross">✗</td>
                            <td class="check">✓</td>
                            <td class="check">✓</td>
                        </tr>
                        <tr>
                            <td><strong>Edit Contributions</strong></td>
                            <td class="cross">✗</td>
                            <td class="cross">✗</td>
                            <td class="check">✓</td>
                            <td class="cross">✗</td>
                        </tr>
                        <tr>
                            <td><strong>Manage Members</strong></td>
                            <td class="cross">✗</td>
                            <td class="cross">✗</td>
                            <td class="cross">✗</td>
                            <td class="check">✓</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderContributionsPage(container) {
    const isEditable = canEditContributions(currentUser.role);

    let html = `
        <div class="page-card">
            <h2>Member Contributions</h2>
    `;

    if (isEditable) {
        html += `
            <div class="add-contribution">
                <h3>Add New Contribution</h3>
                <form id="contributionForm" class="form-grid">
                    <div class="form-group">
                        <label for="contributionMember">Member</label>
                        <select id="contributionMember" name="contributionMember" required>
                            <option value="">Select a member...</option>
                            ${groupData.members.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="contributionAmount">Amount (${groupData.currency})</label>
                        <input type="number" id="contributionAmount" name="contributionAmount" required min="0" step="1000" placeholder="0">
                    </div>
                    <div class="form-group">
                        <label for="contributionDate">Date</label>
                        <input type="date" id="contributionDate" name="contributionDate" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Contribution</button>
                </form>
            </div>
        `;
    }

    const totalContributions = financialData.contributions.reduce((sum, c) => sum + c.amount, 0);

    html += `
        <div class="contributions-summary">
            <h3>Summary</h3>
            <div class="summary-cards">
                <div class="summary-card">
                    <label>Total Contributions</label>
                    <p class="summary-value">${formatCurrency(totalContributions)}</p>
                </div>
                <div class="summary-card">
                    <label>Number of Entries</label>
                    <p class="summary-value">${financialData.contributions.length}</p>
                </div>
            </div>
        </div>
        <div class="contributions-table">
            <h3>Contribution Records</h3>
            <table>
                <thead>
                    <tr>
                        <th>Member Name</th>
                        <th>Amount (${groupData.currency})</th>
                        <th>Date</th>
                        ${isEditable ? '<th>Actions</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${financialData.contributions.map((contrib, idx) => `
                        <tr>
                            <td>${contrib.memberName}</td>
                            <td>${formatCurrency(contrib.amount)}</td>
                            <td>${formatDate(contrib.date)}</td>
                            ${isEditable ? `<td>
                                <button class="btn btn-sm btn-edit" data-index="${idx}">Edit</button>
                                <button class="btn btn-sm btn-danger" data-index="${idx}">Delete</button>
                            </td>` : ''}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
    `;

    container.innerHTML = html;

    if (isEditable) {
        document.getElementById('contributionForm').addEventListener('submit', handleAddContribution);
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', handleEditContribution);
        });
        document.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', handleDeleteContribution);
        });
    }
}

function renderMemberManagementPage(container) {
    container.innerHTML = `
        <div class="page-card">
            <h2>Member Management</h2>
            <div class="add-member">
                <h3>Add New Member</h3>
                <form id="addMemberForm" class="form-grid">
                    <div class="form-group">
                        <label for="newMemberName">Full Name</label>
                        <input type="text" id="newMemberName" name="newMemberName" required placeholder="Enter member name">
                    </div>
                    <div class="form-group">
                        <label for="newMemberUsername">Username</label>
                        <input type="text" id="newMemberUsername" name="newMemberUsername" required placeholder="e.g., member7">
                    </div>
                    <div class="form-group">
                        <label for="newMemberPassword">Password</label>
                        <input type="password" id="newMemberPassword" name="newMemberPassword" required placeholder="Enter password">
                    </div>
                    <div class="form-group">
                        <label for="newMemberRole">Role</label>
                        <select id="newMemberRole" name="newMemberRole" required>
                            <option value="member">Member</option>
                            <option value="secretary">Secretary</option>
                            <option value="treasurer">Treasurer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Member</button>
                </form>
            </div>
            <div class="members-list">
                <h3>Current Members</h3>
                <table class="members-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Current Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${groupData.members.map(member => `
                            <tr>
                                <td>${member.name}</td>
                                <td>${member.username}</td>
                                <td><span class="role-badge role-${member.role}">${member.role.toUpperCase()}</span></td>
                                <td>
                                    <select class="role-reassign" data-member-id="${member.id}">
                                        <option value="">Change Role...</option>
                                        <option value="member" ${member.role === 'member' ? 'selected' : ''}>Member</option>
                                        <option value="secretary" ${member.role === 'secretary' ? 'selected' : ''}>Secretary</option>
                                        <option value="treasurer" ${member.role === 'treasurer' ? 'selected' : ''}>Treasurer</option>
                                        <option value="admin" ${member.role === 'admin' ? 'selected' : ''}>Admin</option>
                                    </select>
                                    <button class="btn btn-sm btn-danger delete-member" data-member-id="${member.id}">Remove</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    document.getElementById('addMemberForm').addEventListener('submit', handleAddMember);
    document.querySelectorAll('.role-reassign').forEach(select => {
        select.addEventListener('change', handleRoleReassign);
    });
    document.querySelectorAll('.delete-member').forEach(btn => {
        btn.addEventListener('click', handleDeleteMember);
    });
}

// ============================================================
// EVENT HANDLERS
// ============================================================

function handleMinutesSave(e) {
    e.preventDefault();
    const date = document.getElementById('minutesDate').value;
    const topics = document.getElementById('minutesTopics').value;
    const actionItems = document.getElementById('minutesActionItems').value;

    if (!date || !topics || !actionItems) {
        alert('Please fill in all fields.');
        return;
    }

    minutesData.records.unshift({
        date,
        topics,
        actionItems
    });

    alert('Minutes saved successfully!');
    renderPage('minutes');
}

function handleAddContribution(e) {
    e.preventDefault();
    const memberId = parseInt(document.getElementById('contributionMember').value);
    const amount = parseInt(document.getElementById('contributionAmount').value);
    const date = document.getElementById('contributionDate').value;

    if (!memberId || !amount || !date) {
        alert('Please fill in all fields.');
        return;
    }

    const member = groupData.members.find(m => m.id === memberId);
    if (!member) {
        alert('Member not found.');
        return;
    }

    financialData.contributions.push({
        memberId,
        memberName: member.name,
        amount,
        date
    });

    groupData.totalMoney += amount;

    alert('Contribution added successfully!');
    renderPage('contributions');
}

function handleEditContribution(e) {
    const index = parseInt(e.target.dataset.index);
    const contrib = financialData.contributions[index];

    const newAmount = prompt(`Edit contribution for ${contrib.memberName}:\nCurrent: ${formatCurrency(contrib.amount)}\nNew amount (${groupData.currency}):`, contrib.amount);
    
    if (newAmount !== null && newAmount !== '') {
        const parsedAmount = parseInt(newAmount);
        if (!isNaN(parsedAmount) && parsedAmount >= 0) {
            const difference = parsedAmount - contrib.amount;
            groupData.totalMoney += difference;
            financialData.contributions[index].amount = parsedAmount;
            alert('Contribution updated successfully!');
            renderPage('contributions');
        } else {
            alert('Invalid amount entered.');
        }
    }
}

function handleDeleteContribution(e) {
    const index = parseInt(e.target.dataset.index);
    const contrib = financialData.contributions[index];

    if (confirm(`Delete contribution of ${formatCurrency(contrib.amount)} from ${contrib.memberName}?`)) {
        groupData.totalMoney -= contrib.amount;
        financialData.contributions.splice(index, 1);
        alert('Contribution deleted successfully!');
        renderPage('contributions');
    }
}

function handleAddMember(e) {
    e.preventDefault();
    const name = document.getElementById('newMemberName').value.trim();
    const username = document.getElementById('newMemberUsername').value.trim();
    const password = document.getElementById('newMemberPassword').value;
    const role = document.getElementById('newMemberRole').value;

    if (!name || !username || !password || !role) {
        alert('Please fill in all fields.');
        return;
    }

    if (USERS_DATABASE.some(u => u.username === username)) {
        alert('Username already exists.');
        return;
    }

    const newId = Math.max(...USERS_DATABASE.map(u => u.id)) + 1;
    const newMember = { id: newId, username, password, name, role };

    USERS_DATABASE.push(newMember);
    groupData.members.push({ ...newMember });
    groupData.memberCount = USERS_DATABASE.length;

    alert(`Member "${name}" added successfully!`);
    document.getElementById('addMemberForm').reset();
    renderPage('member-management');
}

function handleRoleReassign(e) {
    const memberId = parseInt(e.target.dataset.memberId);
    const newRole = e.target.value;

    if (!newRole) return;

    const member = groupData.members.find(m => m.id === memberId);
    const userInDb = USERS_DATABASE.find(u => u.id === memberId);

    if (member && userInDb) {
        const oldRole = member.role;
        member.role = newRole;
        userInDb.role = newRole;
        alert(`Role updated: ${member.name} is now a ${newRole.toUpperCase()}.`);
        renderPage('member-management');
    }
}

function handleDeleteMember(e) {
    const memberId = parseInt(e.target.dataset.memberId);
    const member = groupData.members.find(m => m.id === memberId);

    if (!member) return;

    if (member.id === currentUser.id) {
        alert('You cannot remove yourself!');
        return;
    }

    if (confirm(`Remove ${member.name} from the group?`)) {
        const dbIndex = USERS_DATABASE.findIndex(u => u.id === memberId);
        const groupIndex = groupData.members.findIndex(m => m.id === memberId);

        if (dbIndex !== -1) USERS_DATABASE.splice(dbIndex, 1);
        if (groupIndex !== -1) groupData.members.splice(groupIndex, 1);
        groupData.memberCount = USERS_DATABASE.length;

        alert(`${member.name} has been removed from the group.`);
        renderPage('member-management');
    }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function formatCurrency(amount) {
    return `${groupData.currency} ${Number(amount).toLocaleString('en-US')}`;
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (authenticateUser(username, password)) {
            showMainApp();
        } else {
            alert('Invalid username or password. Try: admin1/password, member1/password, etc.');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }
    });

    // Logout button handler
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Login button on public page
    document.getElementById('loginBtnPublic').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginModal();
    });

    // Modal close button
    document.querySelector('.modal-close').addEventListener('click', closeLoginModal);

    // Close modal on outside click
    document.getElementById('loginModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('loginModal')) {
            closeLoginModal();
        }
    });

    // Public page navigation
    document.querySelectorAll('#publicNavbar .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            renderPublicPage(page);
        });
    });

    // Show public page initially
    showPublicPage();
});
