let currentSearchType = "user"

// Fetches
function fetchUsers(e){
    e.preventDefault()
    fetch(`https://api.github.com/search/users?q=${e.target.querySelector('input').value}`, {
        headers : {
            "accept" : "application/vnd.github.v3+json"
        }
    })
    .then (res => res.json())
    .then (info => renderUsers(info["items"]))
}

function fetchUserRepos(username){
    fetch(`https://api.github.com/users/${username}/repos`, {
        headers : {
            "accept" : "application/vnd.github.v3+json"
        }        
    })
    .then (res => res.json())
    .then (info => renderUserRepos(info))
}

function fetchRepos(e){
    e.preventDefault()
    fetch(`https://api.github.com/search/repositories?q=${e.target.querySelector('input').value}`, {
        headers : {
            "accept" : "application/vnd.github.v3+json"
        }
    })
    .then (res => res.json())
    .then (info => renderRepos(info["items"]))
}

//DOM Changes
function renderUsers(userData) {
    document.getElementById('repos-list').innerHTML = ""
    let userUl = document.getElementById('user-list')
    userUl.innerHTML = ""
    for(const user of userData){
        let li = document.createElement('li')
        userUl.appendChild(li)
        let div = document.createElement('div')
        div.id = user["id"]
        li.appendChild(div)
        let p = document.createElement('p')
        let username = `${user["login"]}`
        p.textContent = `Username: ${username} (click for repo list)`
        p.addEventListener('click', () => fetchUserRepos(username))
        div.appendChild(p)
        let p2 = document.createElement('p')
        p2.textContent = `User Profile: ${user["url"]}`
        div.appendChild(p2)
        let img = document.createElement('img')
        img.src = user["avatar_url"]
        img.style.height = "100px"
        div.appendChild(img)
      }
}

function renderUserRepos(userRepoList) {
    let repoUl = document.getElementById('repos-list')
    let nameLi = document.createElement('li')
    if (userRepoList[0]) {
        nameLi.innerText = `${userRepoList[0]["owner"]["login"]}'s repo list`
    } else {
        nameLi.innerText = 'No repos available!'
    }
    repoUl.innerHTML = ""
    repoUl.appendChild(nameLi)
    for(const repo of userRepoList){
        let li = document.createElement('li')
        let a = document.createElement('a')
        li.appendChild(a)
        a.innerText = repo['name']
        a.href = repo['html_url']
        repoUl.appendChild(li)
    }
}

function renderRepos(repoList){
    document.getElementById('user-list').innerHTML = ""
    let repoUl = document.getElementById('repos-list')
    repoUl.innerHTML = ""
    for(const repo of repoList){
        let li = document.createElement('li')
        let a = document.createElement('a')
        li.appendChild(a)
        a.innerText = repo['name']
        a.href = repo['html_url']
        repoUl.appendChild(li)
      }
}

//Event Listeners
document.getElementById('github-form').addEventListener('submit', (e) => {
    if (currentSearchType === "user") {
        fetchUsers(e)
    } else if (currentSearchType === "repo") {
        fetchRepos(e)
    }
})

document.getElementById('search-users').addEventListener('click', () => {
    document.getElementById('search-users').style.color = "black"
    document.getElementById('search-repos').style.color = "gray"
    currentSearchType = "user"
})

document.getElementById('search-repos').addEventListener('click', () => {
    document.getElementById('search-repos').style.color = "black"
    document.getElementById('search-users').style.color = "gray"
    currentSearchType = "repo"
})