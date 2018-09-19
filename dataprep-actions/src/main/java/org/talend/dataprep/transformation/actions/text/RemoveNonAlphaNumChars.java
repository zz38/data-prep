// ============================================================================
//
// Copyright (C) 2006-2018 Talend Inc. - www.talend.com
//
// This source code is available under agreement available at
// https://github.com/Talend/data-prep/blob/master/LICENSE
//
// You should have received a copy of the agreement
// along with this program; if not, write to Talend SA
// 9 rue Pages 92150 Suresnes, France
//
// ============================================================================

package org.talend.dataprep.transformation.actions.text;

import static java.util.Collections.singletonList;

import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.talend.dataprep.api.action.Action;
import org.talend.dataprep.api.dataset.ColumnMetadata;
import org.talend.dataprep.api.dataset.row.DataSetRow;
import org.talend.dataprep.api.type.Type;
import org.talend.dataprep.parameters.Parameter;
import org.talend.dataprep.transformation.actions.category.ActionCategory;
import org.talend.dataprep.transformation.actions.common.AbstractActionMetadata;
import org.talend.dataprep.transformation.actions.common.ActionsUtils;
import org.talend.dataprep.transformation.actions.common.ColumnAction;
import org.talend.dataprep.transformation.api.action.context.ActionContext;

@Action(RemoveNonAlphaNumChars.ACTION_NAME)
public class RemoveNonAlphaNumChars extends AbstractActionMetadata implements ColumnAction {

    /**
     * The action name.
     */
    public static final String ACTION_NAME = "remove_non_alpha_num_chars"; //$NON-NLS-1$

    protected static final String NEW_COLUMN_SUFFIX = "_only_alpha";

    @Override
    public String getName() {
        return ACTION_NAME;
    }

    @Override
    public String getCategory(Locale locale) {
        return ActionCategory.STRINGS_ADVANCED.getDisplayName(locale);
    }

    @Override
    public boolean acceptField(ColumnMetadata column) {
        return Type.STRING.equals(Type.get(column.getType()));
    }

    private static final boolean CREATE_NEW_COLUMN_DEFAULT = false;

    @Override
    public List<Parameter> getParameters(Locale locale) {
        return ActionsUtils.appendColumnCreationParameter(super.getParameters(locale), locale,
                CREATE_NEW_COLUMN_DEFAULT);
    }

    @Override
    public void compile(ActionContext context) {
        super.compile(context);
        if (ActionsUtils.doesCreateNewColumn(context.getParameters(), CREATE_NEW_COLUMN_DEFAULT)) {
            ActionsUtils.createNewColumn(context, singletonList(
                    ActionsUtils.additionalColumn().withName(context.getColumnName() + NEW_COLUMN_SUFFIX)));
        }
    }

    @Override
    public void applyOnColumn(DataSetRow row, ActionContext context) {
        final String columnId = context.getColumnId();
        final String toCut = row.get(columnId);
        row.set(ActionsUtils.getTargetColumnId(context), apply(toCut));
    }

    protected String apply(String from) {
        if (from == null) {
            return StringUtils.EMPTY;
        }
        final int inputSize = from.length();
        // judge whether surrogate pair exist
        if (inputSize == from.codePointCount(0, inputSize)) {
            return from.replaceAll("[[^\\p{IsAlnum}]&&[^\\p{IsWhite_Space}]]", StringUtils.EMPTY);
        } else {
            return replaceNonAlphaNumAndSpace(from, StringUtils.EMPTY);
        }
    }

    private String replaceNonAlphaNumAndSpace(String inputStr, String replaceStr) {
        StringBuilder resultStr = new StringBuilder(); // $NON-NLS-1$
        for (char str : inputStr.toCharArray()) {
            resultStr.append((Character.isLetter(str) || Character.isDigit(str) || Character.isWhitespace(str)) ? str
                    : replaceStr);
        }
        return resultStr.toString();
    }

    @Override
    public Set<Behavior> getBehavior() {
        return EnumSet.of(Behavior.VALUES_COLUMN);
    }
}
