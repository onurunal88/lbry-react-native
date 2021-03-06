import { connect } from 'react-redux';
import {
  doPurchaseUri,
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
} from 'lbry-redux';
import { doFetchCostInfoForUri, makeSelectCostInfoForUri } from 'lbryinc';
import { doStartDownload } from 'redux/actions/file';
import FileDownloadButton from './view';

const select = (state, props) => ({
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  downloading: makeSelectDownloadingForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  loading: makeSelectLoadingForUri(props.uri)(state),
});

const perform = dispatch => ({
  purchaseUri: (uri, costInfo, saveFile) => dispatch(doPurchaseUri(uri, costInfo, saveFile)),
  restartDownload: (uri, outpoint) => dispatch(doStartDownload(uri, outpoint)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
});

export default connect(
  select,
  perform
)(FileDownloadButton);
