/* @flow */

import { ContentState } from 'draft-js';
import { isEmptyString } from './common';

/**
* Mapping object of block to corresponding markdown symbol.
*/
const blockTypesMapping: Object = {
  unstyled: '',
  'header-one': '# ',
  'header-two': '## ',
  'header-three': '### ',
  'header-four': '#### ',
  'header-five': '##### ',
  'header-six': '###### ',
  'unordered-list-item': '+ ', // todo: this might change depending on the depth
  'ordered-list-item': '1. ', // todo: this might change depending on the depth
  blockquote: '> ',
};

/**
* Function will return markdown symbol for a block.
*/
export function getBlockTagSymbol(type: string): string {
  return type && blockTypesMapping[type];
}

/**
* Function to check if the block is an atomic entity block.
*/
function isAtomicEntityBlock(block: Object): boolean {
  if (block.entityRanges.length > 0 && isEmptyString(block.text)) {
    return true;
  }
  return false;
}

/**
* Function will return markdown for Entity.
*/
function getEntityMarkdown(entityMap: Object, entityKey: number, text: string): string {
  const entity = entityMap[entityKey];
  if (entity.type === 'LINK') {
    return `[${text}](${entity.data.url})`;
  }
  if (entity.type === 'IMAGE') {
    return `!(${entity.data.src})`;
  }
  return text;
}

/**
* Function will return the markdown for block content.
*/
export function getBlockContentMarkdown(block: Object, entityMap: Object): string {
  if (isAtomicEntityBlock(block)) {
    return getEntityMarkdown(entityMap, block.entityRanges[0].key);
  }
  return '';
  // const blockMarkup = [];
  // const entitySections = getEntitySections(block.entityRanges, block.text.length);
  // entitySections.forEach((section, index) => {
  //   let sectionText = getEntitySectionMarkup(block, entityMap, section);
  //   if (index === 0) {
  //     sectionText = trimLeadingZeros(sectionText);
  //   }
  //   if (index === entitySections.length - 1) {
  //     sectionText = trimTrailingZeros(sectionText);
  //   }
  //   blockMarkup.push(sectionText);
  // });
  // return blockMarkup.join('');
}

/**
* Function will return markdown for the block.
*/
function getBlockMarkdown(block: Object, entityMap: Object): string {
  const blockMarkdown = [];
  blockMarkdown.push(getBlockTagSymbol(block.type));
  blockMarkdown.push(getBlockContentMarkdown(block, entityMap));
  blockMarkdown.push('testing');
  blockMarkdown.push('\n');
  return blockMarkdown.join('');
}

/**
* The function will generate markdown for given draftjs editorContent.
*/
export default function draftToMarkdown(editorContent: ContentState): string {
  const markdown = [];
  if (editorContent) {
    const { blocks, entityMap } = editorContent;
    if (blocks && blocks.length > 0) {
      blocks.forEach((block) => {
        markdown.push(getBlockMarkdown(block, entityMap));
      });
    }
  }
  return markdown.join('');
}
