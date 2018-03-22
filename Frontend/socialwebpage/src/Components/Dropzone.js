import Dropzone from 'react-dropzone'
import React, {Component} from 'react';
import { Image } from 'semantic-ui-react'

class Basic extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop(files) {
    this.setState({
      files
    });
  }

  render() {
    return (
      <section>

          <Dropzone id="dz-repair" disablePreview="true" className="upload-dropzone" onDrop={this.onDrop.bind(this)}>
            <p>Try dropping a picture here, or click to select a picture to upload.</p>
          </Dropzone>

        <aside>
          <h4 >Dropped picture</h4>
          <ul>
            {
              this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>

        </aside>
      </section>
    );
  }
}

export default Basic;
