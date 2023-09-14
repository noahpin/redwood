

var supabase = supabase.createClient('https://nfkeopargbmdhkjykzse.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ma2VvcGFyZ2JtZGhranlrenNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyNjgzOTUsImV4cCI6MjAwODg0NDM5NX0.W5d7XZm80DMezYU3_wYbrjYtxRidbrz1vEoqT1nWg48')

window.notebooks = []
window.user = null
window.userMeta = {}

supabase.auth.onAuthStateChange(async (event, session) => {
	if(session) window.currentUser = session.user;
	if (event == "SIGNED_IN") {
		queryUserMeta();
		//queryNotebooks();
		if(typeof populateProjects === "function")populateProjects();
	} else if (event == "SIGNED_OUT") {
		if (
			!window.location.pathname.includes("auth")
		)
			window.location.href = "auth";
	}
});

window.addEventListener("load", async () => {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		if (
			!window.location.pathname.includes("auth")
		)
			window.location.href = "auth";
		return;
	}
	
	if (user) {
		if (
			window.location.pathname.includes("auth")
		)
			window.location.href = "./";
		return;
	}

});

async function queryUserMeta() {
	var { data, err } = await supabase
		.from("users")
		.select()
		.eq("id", window.currentUser.id)
		console.log(data.length)
	if (data.length) {;
		console.log(data[0].display_name +" name")
		console.log("user data found", data[0])
		window.currentUserMeta = data[0];
		if (document.getElementById("accountName")) {
			document.getElementById("accountName").innerHTML =
				window.currentUserMeta.display_name;
		}
	} else {
		console.log("inserting user metadata")
		const { data, error } = await supabase.from("users").insert([
			{
				id: window.currentUser.id,
				display_name: "test",
				created_at: new Date().toISOString(),
				last_login: new Date().toISOString(),
			},
		]);
		if(error) {
			console.log(error)
		}
	}
}

async function queryNotebooks(){
    console.log("notebook")
}

function validateEmail(email) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,100})+$/.test(email))
  {
    return (true)
  }
    return (false)
}

async function signUpSubmitted(event) {
    clearAuthErr()
	event.preventDefault();
	const email = event.target[0].value;
	const password = event.target[1].value;
	const passwordConfirm = event.target[2].value;

    if(!validateEmail(email)) {throwAuthErr("Invalid Email", "email"); return;}
    if(password != passwordConfirm) {throwAuthErr("Passwords do not match", "password"); return;}
    if(password.length < 8) {throwAuthErr("Password must be at least 8 characters", "password"); return;}

	supabase.auth
		.signUp({ email, password })
		.then((response) => {
			response.error ? console.log(response.error.message) : setToken(response);
			supabase.auth.updateUser({ data: { display_name: "test" } });
			console.log(
				"Confirmation Email Sent. If you have not received one in 5 minutes, check your spam folder."
			);
		})
		.catch((err) => {
			alert(err);
		});
}

async function signInSubmitted(event) {
	event.preventDefault();
	const email = event.target[0].value;
	const password = event.target[1].value;
	

    if(!validateEmail(email)) {throwAuthErr("Invalid Email", "email"); return;}

	supabase.auth.signInWithPassword({ email, password }).then((response) => {
		console.log(response.error ? "z" : "b", response);
		if (response.error) {
			if (response.error.message == "Invalid login credentials") {
				throwAuthErr("Invalid Email or Password", ["email", "password"])
			}
		} else {
			console.log("Signed In");
			setToken(response);
			window.location.href = "/";
		}
	});
}

async function logOutSubmitted(event) {
	supabase.auth
		.signOut()
		.then((_response) => {
			console.log("Logout successful");
		})
		.catch((err) => {
			console.log(err.response.text);
		});
}




async function setToken(response) {	
	if (
		response.data.user.confirmation_sent_at &&
		!response?.data?.session?.access_token
	) {
		console.log("Confirmation Email Sent");
	} else {
		console.log("Logged in as " + response.data.user.email);
		const { data, error } = await supabase
			.from("users")
			.insert(
				[{ id: response.data.user.id, last_login: new Date().toISOString() }],
				{
					upsert: true,
				}
			);
		if (error) {
			console.log(error);
		}
	}
}



async function newSupaProject(projData) {
	var id = uuidv4();
	console.log(id);
	const { data, error } = await supabase.from("projects").insert([
		{
			id: id,
			owner: window.currentUser.id,
			updated_at: new Date().toISOString(),
			name: projData.name,
			data: { ...projData },
		},
	]);
	if (error) {
		console.log(error);
	}
	if (data) {
		window.allLoadedProjects.push(data[0]);
	}
	queryProjects();
	populateProjects();
	openProject(id);
	return id;
}
//function to create random uuid
function uuidv4() {
	if (crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
async function updateProject(id, dat) {
	const { data, error } = await supabase
		.from("projects")
		.update({
			data: dat,
			name: dat.name,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id);
	if (error) {
		console.log(error);
		cloudSyncError();
	} else {
		postCloudSync();
	}
	queryProjects();
}

function selectProject(pID) {
	console.log("Loading project " + pID + "...");
	queryProjects().then(() => {
		window.currentProject = window.allLoadedProjects.find((e) => e.id == pID);
		loadFile(window.currentProject.data);
	});
	//document.getElementById("data").value = window.currentProject.data.msg
}
