const searchUser = document.querySelector(".search");
const userRepoContent = document.querySelector(".user-repo-content");

searchUser.addEventListener("submit", async (event) => {
  event.preventDefault();

  resetForm();

  const username = event.target.querySelector(".username-input").value;
  const userData = await getUserData(username);
  event.target.querySelector(".username-input").value = ""; //* Dessa forma tiramos o valor do input;

  if (userData) {
    const userRepo = await getUserRepo(username);
    displayGithub(userData, userRepo);
  }
});

async function getUserData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    alert("Usuário não encontrado. Por favor, tente novamente.");
  }
}

async function getUserRepo(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=4`
  );
  const data = await response.json();
  return data;
}

function displayGithub(userData, userRepo) {
  document.querySelector(".user-container").classList.remove("hide");

  document.querySelector(".user-avatar").src = userData.avatar_url;
  document.querySelector(".user-avatar").alt = userData.name;
  document.querySelector(".user-name").textContent = userData.name;
  document.querySelector(".user-login").textContent = userData.login;
  document.querySelector(".user-followers").textContent = userData.followers;
  document.querySelector(".user-bio").textContent = userData.bio;

  if (userRepo.length > 0) {
    userRepo.forEach((repo) => {
      const userRepoLi = document.createElement("li");
      userRepoLi.classList.add(".user-repo");

      const header = document.createElement("header");
      userRepoLi.appendChild(header);
      //* appendChild linka o elemento citado ao que fica logo acima

      //*Os blocos não estavam podendo ser usados com border-radius, deixando os documentos "abertos"
      // const repoTitle = document.createElement("strong");
      // repoTitle.classList.add(".repo-title");
      // repoTitle.textContent = repo.name;
      // header.appendChild(repoTitle);

      const link = document.createElement("a");
      link.classList.add("repo-link");
      link.href = repo.html_url;
      link.target = "_blank";
      link.textContent = repo.name;
      header.appendChild(link);

      const createdAtContainer = document.createElement("div");
      createdAtContainer.classList.add("user-repo-container");
      createdAtContainer.textContent = "Criado em:";
      userRepoLi.appendChild(createdAtContainer);

      const repoCreated = document.createElement("span");
      repoCreated.classList.add("repo-criado");
      const createdAt = new Date(repo.created_at);
      const createdAdFormatted = new Intl.DateTimeFormat("pt-BR").format(
        createdAt
      );
      repoCreated.textContent = createdAdFormatted;
      createdAtContainer.appendChild(repoCreated);

      userRepoContent.appendChild(userRepoLi);
    });
  } else {
    userRepoContent.textContent = "Nenhum repositório encontrado 😢";
    userRepoContent.classList.add("no-repo");
  }
}
function resetForm() {
  document.querySelector(".user-container").classList.add("hide");
  userRepoContent.classList.remove("no-repo");

  while (userRepoContent.firstChild) {
    userRepoContent.removeChild(userRepoContent.firstChild);
  }
}
