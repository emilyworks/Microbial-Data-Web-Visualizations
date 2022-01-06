// set up function that allows user to select id

async function optionChanged(id) {

  const response = await fetch("./samples.json");
  const data = await response.json();
  names = data.names;

  for (let x = 0; x < names.length; x++) {
    name = names[x]
    const section = document.querySelector('#selDataset')
    option = document.createElement("option")
    option.setAttribute("value", name)
    option.textContent = `${name}`
    section.append(option)
  }

  // set up a default plot corresponding to id 940

  samples = data.samples;

  def_ids = samples[0].otu_ids.slice(0, 10)
  def_vals = samples[0].sample_values.slice(0, 10)
  def_labels = samples[0].otu_labels.slice(0, 10)

  def_ids = def_ids.map(def_ids => 'Otu' + `${def_ids}`)

  default_plot = [{
    type: 'bar',
    x: def_vals.reverse(),
    y: def_ids.reverse(),
    text: def_labels.reverse(),
    orientation: 'h'

  }]

  let layout = {
    title: "Top 10 OTU Ids",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };

  Plotly.newPlot("plot", default_plot, layout);

  // set up default demographic information

  if (document.querySelector('#sample-metadata').innerHTML.length < 1) {

    demo_id = '940'
    demo_eth = data.metadata[0].ethnicity
    demo_gender = data.metadata[0].gender
    demo_age = data.metadata[0].age
    demo_loc = data.metadata[0].location
    demo_bbtype = data.metadata[0].bbtype
    demo_wfreq = data.metadata[0].wfreq

    demo_list = [demo_id, demo_eth, demo_gender, demo_age, demo_loc, demo_bbtype, demo_wfreq]
    demo_labels = ['Id', 'ethnicity', 'gender', 'age', 'location', 'bbtype', 'wfreq']

    console.log(demo_labels)

    const demo_section = document.querySelector('#sample-metadata')
    list = document.createElement("ul")
    list.setAttribute("class", 'list_marker')
    demo_section.append(list)


    for (let r = 0; r < demo_list.length; r++) {
      bullet = document.createElement("li")
      bullet.textContent = `${demo_labels[r]} : ${demo_list[r]}`
      list.append(bullet)
    }
  }

  // set up the default bubble chart with all the samples
  let def_trace = {
    x: samples[0].otu_ids,
    y: samples[0].sample_values,
    mode: 'markers',
    marker: {
      color: samples[0].otu_ids,
      size: samples[0].sample_values
    },
    text: samples[0].otu_labels
  };
  
  let default_bubble = [def_trace];
  
  var default_bubble_lay = {
    title: 'OTU Ids Sized by Sample Value',
    showlegend: false,
    height: 600,
    width: 1000
  };
  
  Plotly.newPlot('bubble', default_bubble, default_bubble_lay);


  //loop through the samples and if the id matches, pull in the id's sample_values, otu_labels, and otu_ids
  for (let i = 0; i < samples.length; i++) {

    if (samples[i].id == id) {

      // pulling in the sample values

      sample = samples[i].sample_values.slice(1, 10)
      // pulling in the sample otu_ids

      otu_id_sample = samples[i].otu_ids.slice(1, 10)

      // pulling in the sample otu_labels

      otu_label_sample = samples[i].otu_labels.slice(1, 10)

      sample = sample.sort((firstNum, secondNum) => secondNum - firstNum);
      otu_id_sample = otu_id_sample.sort((firstNum, secondNum) => secondNum - firstNum);
      otu_label_sample = otu_label_sample.sort((firstNum, secondNum) => secondNum - firstNum);

      otu_id_sample = otu_id_sample.map(def_ids => 'Otu' + `${def_ids}`)

      // restyle the bar chart with the new information for the relevant id
      Plotly.restyle('plot', "y", [otu_id_sample]);
      Plotly.restyle('plot', "x", [sample])
      Plotly.restyle('plot', "text", [otu_label_sample])

      // similarly, change the demographic information based on the new selected id
      demo_id = id
      demo_eth = data.metadata[i].ethnicity
      demo_gender = data.metadata[i].gender
      demo_age = data.metadata[i].age
      demo_loc = data.metadata[i].location
      demo_bbtype = data.metadata[i].bbtype
      demo_wfreq = data.metadata[i].wfreq

      demo_list_new = [demo_id, demo_eth, demo_gender, demo_age, demo_loc, demo_bbtype, demo_wfreq]

      let new_demo = document.querySelectorAll('.list_marker li')

      for (let r = 0; r < demo_list_new.length; r++) {
        console.log(new_demo[r].innerText)
        new_demo[r].innerText = `${demo_labels[r]} : ${demo_list_new[r]}`
      }

      // restyle the bubble chart according to the new id
      
      Plotly.restyle('bubble', 'x', [samples[i].otu_ids]);
      Plotly.restyle('bubble', 'y', [samples[i].sample_values]);
      Plotly.restyle('bubble', 'marker.color', [samples[i].otu_ids]);
      Plotly.restyle('bubble', 'marker.size', [samples[i].sample_values]);
      Plotly.restyle('bubble', 'text', [samples[i].otu_labels])

    }


  }
}
optionChanged()
