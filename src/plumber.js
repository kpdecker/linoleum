import plumber from 'gulp-plumber';
import {WATCHING} from '../index';

export default function() {
  return plumber({errorHandler: WATCHING});
}
