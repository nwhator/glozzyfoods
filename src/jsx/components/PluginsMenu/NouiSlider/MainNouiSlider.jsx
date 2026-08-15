import React, { Fragment, useEffect } from "react";


import Nouislider from "nouislider-react";


import PageTitle from "../../../layouts/PageTitle";


let slider, slider2;

// function destroyExistingSlider(){
//   if(slider && slider.noUiSlider){
//     slider.noUiSlider.destroy();
//   }
// }


function MainNouiSlider() {

  useEffect(() => {

    //destroyExistingSlider();

    // slider = document.getElementById('W3NoUISlider');


    // slider2 = document.getElementById('W3NoUISlider2');

    // noUiSlider.create(slider, {
    //     start: [20, 80],
    //     connect: true,
    //     range: {
    //         'min': 0,
    //         'max': 100
    //     }
    // });


    //   noUiSlider.create(slider2, {
    //     start: [20, 80],
    //     connect: true,
    //     range: {
    //         'min': 0,
    //         'max': 100
    //     }
    //   });

  });

  return (
    <Fragment>
      <PageTitle motherMenu="Components" activeMenu="UI Slider" />
      <div className="row">
        <div className="col-xl-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Basic slider</h4>
            </div>
            <div className="card-body">
              <div id="basic-slider">

                <div id="W3NoUISlider"></div>
                <div id="W3NoUISlider2"></div>


                <Nouislider
                  accessibility
                  start={10}
                  step={10}
                  range={{
                    min: 0,
                    max: 100,
                  }}
                // onUpdate={this.onUpdate(index)}
                />

              </div>
            </div>
          </div>
        </div>

      </div>
    </Fragment>
  );
};

export default MainNouiSlider;
