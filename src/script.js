document.addEventListener("DOMContentLoaded", () => {
    bar = document.querySelector(".cats")
    entriez = document.querySelector(".main")
    reviewz = document.querySelector(".reviewz")
    new_form = document.querySelector("form.entry-form")
    review_form = document.querySelector("form.review-form")
    currentcat = document.querySelector("input#cat-id")
    currentent = document.querySelector("input#entry-id")

    function getcats(){
        bar.innerText = ""
    fetch("http://localhost:3000/api/categories")
    .then(res => res.json())
    .then(cats => cats.forEach(cat => showcat(cat))) 
    }

    function showcat(cat){
        
        // bar.innerText = ""
        let elem = document.createElement("span")
        elem.innerText = cat.title 
        bar.append(elem) 
     


        elem.addEventListener("click", () => showentries(cat))
    }

    function showentries(cat){
        reviewz.innerHTML = ""
        catId = cat.id
        currentcat.value = cat.id
        entriez.innerHTML = ""
        cat.entries.forEach(entry => show(entry))
     }

        function show(entry){
            let container = document.createElement("div")
            container.style.border = "thick solid #FFD400"
            let title = document.createElement("h3")
            title.innerText = entry.title
            title.style.color = "white"
            title.style.fontWeight = "bold"
            let pic = document.createElement("img")
            pic.src = entry.imgurl
            let desc = document.createElement("p")
            desc.innerText = entry.description 
            desc.style.color = "white"
            desc.style.fontWeight = "bold"
            let space = document.createElement("br")
            let entrylike = document.createElement("button")
            entrylike.innerText = `Likes: ${entry.likes}`
            container.append(title, space, pic, desc)
            container.append(entrylike)
            entriez.append(container)

            entrylike.addEventListener("click", () =>{
               let newlikes = parseInt(entry.likes) + 1

               const objConfig = {
                   method: "PATCH",
                   headers: {
                       "Content-Type": "application/json"
                   },
                   body: JSON.stringify({
                      likes: newlikes   
                   })
               }

               fetch(`http://localhost:3000/api/entries/${entry.id}`, objConfig)
               .then(resp => resp.json())
               .then(updatedentry => {
                   entry = updatedentry
                   entrylike.innerText = `Likes: ${updatedentry.likes}`
               })

            })


            container.addEventListener("click", () => getreviews(entry))
        }

            function getreviews(entry){
                currentent.value = entry.id 

                reviewz.innerHTML = ""
                fetch(`http://localhost:3000/api/entries/${entry.id}`)
                .then(res => res.json())
                .then (ent => showreviews(ent))
            }

            function showreviews(ent){
                if(ent.reviews){
                ent.reviews.forEach(rev => display(rev))
                }
            }


            function display(rev){
            let container = document.createElement("div")
            let desc = document.createElement("p")
            desc.innerText = `Reviewed by: ${rev.name}` 
            desc.style.color = "white"
            container.style.border = "thick solid #FFD400"
            container.innerText = rev.info
            container.style.color = "white"
            let addlikez = document.createElement("button")
            addlikez.innerText = `Likes: ${rev.likes}`
            container.append(desc, addlikez)

            addlikez.addEventListener("click", () =>{
                let newlikes = parseInt(rev.likes) + 1
 
                const objConfig = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                       likes: newlikes   
                    })
                }
 
                fetch(`http://localhost:3000/api/reviews/${rev.id}`, objConfig)
                .then(resp => resp.json())
                .then(updatedrev => {
                    rev = updatedrev
                    addlikez.innerText = `Likes: ${updatedrev.likes}`
                })
 
             })

            reviewz.append(container)
            }
            

    getcats()

    new_form.addEventListener("submit", (e) => {
        e.preventDefault()

        let id = new_form.elements[0].value
        let title = e.target[1].value 
        let pic = e.target[2].value 
        let desc = e.target[3].value 

        const objConfig = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category_id: parseInt(id),
                title: title, 
                imgurl: pic, 
                description: desc, 
                likes: 0
            })

        }

        fetch("http://localhost:3000/api/entries", objConfig)
        .then(res => res.json())
        .then(newentry => {
            show(newentry)
            new_form.reset()

        })

    })

    review_form.addEventListener("submit", (e) => {
        e.preventDefault()

        let id = review_form.elements[0].value
        let name = e.target[1].value 
        let review = e.target[2].value 
        const objConfig = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                entry_id: parseInt(id),
                name: name,
                info: review,  
                likes: 0
            })

        }

        fetch("http://localhost:3000/api/reviews", objConfig)
        .then(res => res.json())
        .then(newrev => {
            display(newrev)
            review_form.reset()

        })

    })
})